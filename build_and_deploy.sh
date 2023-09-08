ENV=${1:?"Must set environment as first arg"}
echo $ENV
BASE_GAR_DIRECTORY=us-west1-docker.pkg.dev/global-mangroves
IMAGE=${BASE_GAR_DIRECTORY}/base/coastal_resilience_explorer_frontend_${ENV}
SERVICE=coastal-resilience-explorer-frontend-${ENV}
_USE_SITE_GATING=true
_SITE_GATING_MATCH=xxx

# Some code here to determine if site gating should be used based on the ENV parameter.

echo """
steps:
- name: "gcr.io/cloud-builders/docker"
  args: [
        "build",
        "--build-arg",
        "REACT_APP_USE_SITE_GATING=${_USE_SITE_GATING}",
        "--build-arg",
        "REACT_APP_SITE_GATING_MATCH=${_SITE_GATING_MATCH}",
        "-t",
        "$IMAGE",
        ".",
      ]
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '$IMAGE']
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
# substitutions:
#   _USE_SITE_GATING: 'true'
#   _SITE_GATING_MATCH: 'null'
images:
  - "gcr.io/$PROJECT_ID/react-app"
""" > /tmp/cloudbuild.yaml

gcloud builds submit --config /tmp/cloudbuild.yaml
