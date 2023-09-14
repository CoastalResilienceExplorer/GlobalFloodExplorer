import os
from cloudevents.http import from_http
from flask import Flask, request
from google.events.cloud.storage import StorageObjectData
import logging
from google.cloud import storage
import uuid
import subprocess
import requests
import threading

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
    # generation_match_precondition = 0

    blob.upload_from_filename(
        source_file_name, 
        # if_generation_match=generation_match_precondition
    )

    logging.info(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )


@app.route("/build_COG/", methods=["POST"])
def build_cog():
    """Handle tile requests."""
    # event = from_http(request.headers, request.get_data())
    logging.info(request.get_json())
    logging.info(type(request.get_json()))
    # logging.info(request.get_json().decode())
    # logging.info(type(request.get_data().decode()))
    data = request.get_json()
    id = str(uuid.uuid1())
    tmp = f'/tmp/{id}.tif'
    tmp_cog = f'/tmp/{id}_cog.tif'
    download_blob(data['bucket'], data['name'], tmp)
    bashCommand = f"gdalwarp {tmp} {tmp_cog} -of COG"
    process = subprocess.Popen(bashCommand.split(' '), stdout=subprocess.PIPE)
    logging.info('Preparing COG')
    while True:
        line = process.stdout.readline()
        if not line: break
        print(line, flush=True)
    upload_blob('cloud-native-geospatial', tmp_cog, data['name'])
    logging.info('Done')
    return (
        f"Completed",
        200,
    )


@app.route("/", methods=["POST"])
def index():
    """Handle tile requests."""
    def request_task(url, json):
        requests.post(url, json=json)

    def fire_and_forget(url, json):
        threading.Thread(target=request_task, args=(url, json)).start()

    try:
        event = from_http(request.headers, request.get_data())
        logging.info(request.get_data())
        logging.info(event.data['id'])

        # Gets the GCS bucket name from the CloudEvent data
        # Example: "storage.googleapis.com/projects/_/buckets/my-bucket"
        # try:
        gcs_object = os.path.join(event.data['bucket'], event.data['name'])
        logging.info(gcs_object)
        logging.info(os.environ['FORWARD_SERVICE'])
        fire_and_forget(
            f"{os.environ['FORWARD_SERVICE']}/{os.environ['FORWARD_PATH']}", 
            json={
                'bucket':event.data['bucket'],
                'name': event.data['name']
            }
        )

        return (
            f"Forwarded to {os.environ['FORWARD_SERVICE']}",
            200,
        )
    except:
        return (
            f"Something went wrong, but returning 200 to prevent PubSub infinite retries",
            200,
        )

@app.get('/')
def test():
    return 'OK'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
