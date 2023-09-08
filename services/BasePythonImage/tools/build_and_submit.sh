ENV=${1:?"Must set environment as first arg"}
echo $ENV
BASE_GAR_DIRECTORY=us-west1-docker.pkg.dev/global-mangroves
BASE_IMAGE=${BASE_GAR_DIRECTORY}/base/python_gis_base_${ENV}

echo """
steps:
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['builds', 'submit', '-t', '$BASE_IMAGE', '.']
  dir: '.'
""" > /tmp/cloudbuild.yaml

gcloud builds submit \
    --config /tmp/cloudbuild.yaml