gcloud beta run domain-mappings create --service frontend-dev --domain ${ENV}.coastalresilienceexplorer.org --region us-west1
gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq 
RESOURCE_NAME=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].name')
RESOURCE_DATA=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].rrdata')
RESOURCE_TYPE=$(gcloud beta run domain-mappings describe --domain ${ENV}.coastalresilienceexplorer.org --region us-west1 | yq '.status.resourceRecords[0].type')
MANAGED_ZONE=coastalresilienceexplorer
NAME=dev.coastalresilienceexplorer.org
gcloud dns record-sets transaction start \
   --zone=$MANAGED_ZONE

gcloud dns record-sets transaction remove $RESOURCE_DATA \
   --name=${ENV}.coastalresilienceexplorer.org \
   --ttl=300 \
   --type=$RESOURCE_TYPE \
   --zone=$MANAGED_ZONE

gcloud dns record-sets transaction add $RESOURCE_DATA \
   --name=${ENV}.coastalresilienceexplorer.org \
   --ttl=300 \
   --type=$RESOURCE_TYPE \
   --zone=$MANAGED_ZONE

gcloud dns record-sets transaction execute \
   --zone=$MANAGED_ZONE