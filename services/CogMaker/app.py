import os
from cloudevents.http import from_http
from flask import Flask, request
from google.events.cloud.storage import StorageObjectData
import logging
from google.cloud import storage
import uuid
import subprocess

logging.basicConfig()
logging.root.setLevel(logging.INFO)

app = Flask(__name__)

def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    # The ID of your GCS object
    # source_blob_name = "storage-object-name"

    # The path to which the file should be downloaded
    # destination_file_name = "local/path/to/file"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)

    # Construct a client side representation of a blob.
    # Note `Bucket.blob` differs from `Bucket.get_blob` as it doesn't retrieve
    # any content from Google Cloud Storage. As we don't need additional data,
    # using `Bucket.blob` is preferred here.
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    logging.info(
        "Downloaded storage object {} from bucket {} to local file {}.".format(
            source_blob_name, bucket_name, destination_file_name
        )
    )

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to upload is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    generation_match_precondition = 0

    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )


@app.route("/", methods=["POST"])
def index():
    """Handle tile requests."""
    logging.info(request)
    event = from_http(request.headers, request.get_data())
    logging.info(event)

    # Gets the GCS bucket name from the CloudEvent data
    # Example: "storage.googleapis.com/projects/_/buckets/my-bucket"
    # try:
    gcs_object = os.path.join(event.data['bucket'], event.data['name'])
    logging.info(gcs_object)
    update_time = event.data['timeCreated']
    id = str(uuid.uuid1())
    tmp = f'/tmp/{id}.tif'
    tmp_cog = f'/tmp/{id}_cog.tif'
    download_blob(event.data['bucket'], event.data['name'], tmp)
    bashCommand = f"gdalwarp {tmp} {tmp_cog} -of COG"
    process = subprocess.Popen(bashCommand.split(' '), stdout=subprocess.PIPE)
    logging.info('Preparing COG')
    while True:
        line = process.stdout.readline()
        if not line: break
        print(line, flush=True)
    upload_blob('cloud-native-geospatial', tmp_cog, event.data['name'])
    logging.info('Done')

    return (
        f"Cloud Storage object changed: {gcs_object}"
        + f" updated at {update_time}",
        200,
    )
    # except ValueError as e:
    #     return (f"Failed to parse event data: {e}", 400)

@app.get('/')
def test():
    return 'OK'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
    # app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
# x = xr.open_dataset(ghsl)
# x.band_data.isel(band=0).chunk(1000).to_zarr("GHSL_COG.zarr")
# x.band_data.isel(band=0).chunk(100).rio.to_raster("GHSL_COG.tif", driver="COG")
