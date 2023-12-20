## For adhoc processing
Uses the base image built from GeospatialServices

```
docker run \
    -it \
    -v /Users/chlowrie/Downloads/CWON_Tesselas/:/data \
    -v $PWD:/app \
    --entrypoint bash \
    us-west1-docker.pkg.dev/global-mangroves/base/python_gis_base_dev:latest

```