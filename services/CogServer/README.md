## Purpose
To serve raster tiles from GCS

### Sources
- https://cogeotiff.github.io/rio-tiler/advanced/dynamic_tiler/
- https://github.com/cogeotiff/rio-tiler
- https://cogeotiff.github.io/rio-tiler/colormap/

### TODO
- Add capacity to query a point, line, and polygon
- Add proper test case in deployment, maybe just by querying a `0/0/0.png` tile and seeing if we get a result

# Local Development
1. Build an image with `bash build_and_submit.sh dev`
2. `docker run -it -v $PWD:/app --entrypoint uvicorn -p 3004:8080 us-west1-docker.pkg.dev/global-mangroves/cogserver/cogserver_dev app:app --reload --host 0.0.0.0 --port 8080`