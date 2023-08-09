ENV=${1:?"Must set environment as first arg"}
echo $ENV
SERVICE_NAME=frontend-${ENV}
echo $SERVICE_NAME
IMAGE=gcr.io/global-mangroves/frontend:${ENV}

echo """
    steps:
    - name: 'gcr.io/cloud-builders/gcloud'
      args: ['builds', 'submit', '-t', '$IMAGE', '.']
    - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
      entrypoint: gcloud
      args: ['run', 'deploy', '$SERVICE_NAME', '--image', '$IMAGE', '--allow-unauthenticated', '--region', 'us-west1']
    - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
      entrypoint: gcloud
      args: ['beta', 'run', 'domain-mappings', 'create', '--service', '$SERVICE_NAME', '--domain', '${ENV}.coastalresilienceexplorer.org', '--region', 'us-west1']
    # images:
    # - $IMAGE
""" > /tmp/cloudbuild.yaml

# gcloud builds submit --config /tmp/cloudbuild.yaml


# gcloud beta run domain-mappings create --service frontend-dev --domain ${ENV}.coastalresilienceexplorer.org --region us-west1
RESOURCE_NAME=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].name')
RESOURCE_DATA=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].rrdata')
RESOURCE_TYPE=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].type')
gcloud dns --project=global-mangroves record-sets update ${ENV}.coastalresilienceexplorer.org --type=$RESOURCE_TYPE --zone="coastalresilienceexplorer" --rrdatas=$RESOURCE_DATA --ttl="300"
# gcloud projects add-iam-policy-binding global-mangroves \
#       --member='serviceAccount:220082085305@cloudservices.gserviceaccount.com' \
#       --role='roles/run.developer'