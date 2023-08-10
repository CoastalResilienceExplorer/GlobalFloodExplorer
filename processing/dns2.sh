MANAGED_ZONE=coastalresilienceexplorer
NAME=dev.coastalresilienceexplorer.org
gcloud dns record-sets transaction start \
   --zone=$MANAGED_ZONE

gcloud dns record-sets transaction add RR_DATA \
   --name=$NAME \
   --ttl=300 \
   --type="CNAME" \
   --zone=$MANAGED_ZONE