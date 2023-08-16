ENV=${1:?"Must set environment as first arg"}
echo $ENV
BASE_GAR_DIRECTORY=us-west1-docker.pkg.dev/global-mangroves
BASE_IMAGE=${BASE_GAR_DIRECTORY}/base/python_gis_base_dev
COGMAKER_IMAGE=${BASE_GAR_DIRECTORY}/cogmaker/cogmaker_${ENV}
COGMAKER_SERVICE=cogmaker-${ENV}
COGMAKER_SERVICE_FRONT=cogmaker-front-${ENV}

echo """
steps:
# - name: 'gcr.io/cloud-builders/gcloud'
#   args: ['builds', 'submit', '-t', '$BASE_IMAGE', '.']
#   dir: 'BasePythonImage'
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '--build-arg', 'BASE_IMAGE=$BASE_IMAGE', '-t', '$COGMAKER_IMAGE', '.']
  dir: 'CogMaker'
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '$COGMAKER_IMAGE']
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['run', 'deploy', 
    '$COGMAKER_SERVICE', 
    '--image', '$COGMAKER_IMAGE', 
    '--allow-unauthenticated', 
    '--region', 'us-west1', 
    '--service-account', 'cog-maker@global-mangroves.iam.gserviceaccount.com',
    '--cpu', '4',
    '--memory', '16G',
    '--timeout', '3600'
    ]
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['run', 'deploy', 
    '${COGMAKER_SERVICE_FRONT}', 
    '--image', '$COGMAKER_IMAGE', 
    '--set-env-vars', 'FORWARD_SERVICE=$(gcloud run services describe $COGMAKER_SERVICE --platform managed --region us-west1 --format 'value(status.url)')',
    '--set-env-vars', 'FORWARD_PATH=/build_COG/',
    '--allow-unauthenticated', 
    '--region', 'us-west1', 
    '--service-account', 'cog-maker@global-mangroves.iam.gserviceaccount.com'
    ]
images:
# - $BASE_IMAGE
- $COGMAKER_IMAGE
""" > /tmp/cloudbuild.yaml

gcloud builds submit \
    --config /tmp/cloudbuild.yaml

# echo $(gcloud run services describe $COGMAKER_SERVICE --platform managed --region us-west1 --format 'value(status.url)')

bash ./CogMaker/eventarc.sh $ENV $COGMAKER_SERVICE_FRONT

# Test
gsutil -m cp CogMaker/test/small.tif gs://test-tiff-to-cog/test/small.tif
# gsutil -m cp CogMaker/test/medium.tif gs://test-tiff-to-cog/test/medium.tif
# TODO, implement a proper test that fails
