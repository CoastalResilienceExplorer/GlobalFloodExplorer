ENV=${1:?"Must set environment as first arg"}
echo $ENV

echo """
steps:
- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'bash'
  args: ['tools/build_and_submit.sh', '$ENV']
  dir: 'BasePythonImage'
- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'bash'
  args: ['tools/build_and_submit.sh', '$ENV']
  dir: 'CogMaker'
- name: 'gcr.io/cloud-builders/gcloud'
  entrypoint: 'bash'
  args: ['tools/build_and_submit.sh', '$ENV']
  dir: 'CogServer'
""" > /tmp/cloudbuild.yaml

gcloud builds submit \
    --config /tmp/cloudbuild.yaml
