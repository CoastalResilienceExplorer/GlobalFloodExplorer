ENV=${1:?"Must set environment as first arg"}
echo $ENV
_USE_SITE_GATING=${2:-"false"}
echo $_USE_SITE_GATING
_SITE_GATING_MATCH=${3:-"null"}
echo $_SITE_GATING_MATCH
BASE_GAR_DIRECTORY=us-west1-docker.pkg.dev/global-mangroves
IMAGE=${BASE_GAR_DIRECTORY}/base/coastal_resilience_explorer_frontend_${ENV}
SERVICE=coastal-resilience-explorer-frontend-${ENV}

# Some code here to determine if site gating should be used based on the ENV parameter.

echo """
steps:
- name: "gcr.io/cloud-builders/docker"
  id: 'build-image'
  args: [
    "build",
    "--build-arg",
    "REACT_APP_USE_SITE_GATING=${_USE_SITE_GATING}",
    "--build-arg",
    "REACT_APP_SITE_GATING_MATCH=${_SITE_GATING_MATCH}",
    "--build-arg",
    "SENTRY_AUTH_TOKEN=\$$SENTRY_AUTH_TOKEN",
    "-t",
    "$IMAGE",
    "."
  ]
  secretEnv: ['SENTRY_AUTH_TOKEN']
- name: 'gcr.io/cloud-builders/docker'
  id: 'push-image'
  args: ['push', '$IMAGE']
  waitFor: ['build-image']
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['run', 'deploy', 
      '$SERVICE', 
      '--image', '$IMAGE', 
      '--allow-unauthenticated', 
      '--region', 'us-west1', 
      '--cpu', '1',
      '--memory', '2G',
      '--timeout', '3600'
   ]
  waitFor: ['push-image']
availableSecrets:
  secretManager:
  - versionName: projects/220082085305/secrets/SENTRY_AUTH_TOKEN/versions/latest
    env: 'SENTRY_AUTH_TOKEN'
""" > /tmp/cloudbuild.yaml

gcloud builds submit --config /tmp/cloudbuild.yaml
