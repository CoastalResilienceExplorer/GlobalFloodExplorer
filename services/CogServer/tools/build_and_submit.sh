ENV=${1:?"Must set environment as first arg"}
echo $ENV
SERVICE_BASE_NAME=cogserver
BASE_GAR_DIRECTORY=us-west1-docker.pkg.dev/global-mangroves
BASE_IMAGE=${BASE_GAR_DIRECTORY}/base/python_gis_base_${ENV}
IMAGE=${BASE_GAR_DIRECTORY}/${SERVICE_BASE_NAME}/${SERVICE_BASE_NAME}_${ENV}
SERVICE=${SERVICE_BASE_NAME}-${ENV}

echo """
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '--build-arg', 'BASE_IMAGE=$BASE_IMAGE', '-t', '$IMAGE', '.']
  dir: '.'
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '$IMAGE']
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['run', 'deploy', 
    '$SERVICE', 
    '--image', '$IMAGE', 
    '--allow-unauthenticated', 
    '--region', 'us-west1', 
    '--service-account', 'cog-maker@global-mangroves.iam.gserviceaccount.com',
    '--cpu', '2',
    '--memory', '8G',
    '--timeout', '30'
    ]
""" > /tmp/cloudbuild.yaml

gcloud builds submit \
    --config /tmp/cloudbuild.yaml
