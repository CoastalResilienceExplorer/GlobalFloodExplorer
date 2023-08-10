# https://cloud.google.com/run/docs/configuring/static-outbound-ip
NETWORK_NAME=default
SUBNET_NAME=${NETWORK_NAME}-subnet
RANGE=10.124.0.0/28
REGION=us-west1
gcloud compute networks subnets create ${NETWORK_NAME}-subnet \
    --range=$RANGE --network=$NETWORK_NAME --region=$REGION

CONNECTOR_NAME=connector-test
gcloud compute networks vpc-access connectors create $CONNECTOR_NAME \
  --region=$REGION \
  --subnet-project=global-mangroves \
  --subnet=${NETWORK_NAME}-subnet

ROUTER_NAME=router1
gcloud compute routers create $ROUTER_NAME \
  --network=$NETWORK_NAME \
  --region=$REGION

ORIGIN_IP_NAME=static1
gcloud compute addresses create $ORIGIN_IP_NAME --region=$REGION

gcloud compute routers nats create nat1 \
  --router=$ROUTER_NAME \
  --region=$REGION \
  --nat-custom-subnet-ip-ranges=$SUBNET_NAME \
  --nat-external-ip-pool=$ORIGIN_IP_NAME

ENV=staging
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
    images:
    - $IMAGE
""" > /tmp/cloudbuild.yaml

gcloud builds submit --config /tmp/cloudbuild.yaml