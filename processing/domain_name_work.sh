# https://cloud.google.com/domains/docs/transfer-domain-from-another-registrar
DOMAIN_NAME='coastalresilienceexplorer.org'

gcloud domains registrations get-transfer-parameters $DOMAIN_NAME

gcloud domains registrations transfer $DOMAIN_NAME