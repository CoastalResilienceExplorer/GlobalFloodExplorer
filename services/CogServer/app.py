from rio_tiler.io import Reader
import xarray as xr
import rioxarray as rxr
from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rio_tiler.profiles import img_profiles
from rio_tiler.colormap import cmap
import logging
import uvicorn
log = logging.Logger('log')
log.setLevel(logging.INFO)

from google.cloud import storage

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

GCS_BASE='gs://cloud-native-geospatial'

def get_tiffs(bucket, prefix="/test"):
    pass


@app.get(
    r"/{z}/{x}/{y}.png",
    responses={
        200: {
            "content": {"image/png": {}}, "description": "Return an image.",
        }
    },
    response_class=Response,
    description="Read COG and return a tile",
)
def tile(
    z: int,
    x: int,
    y: int,
    dataset: str,
    color: str = 'ylorrd',
    max_val: int = 10000,
    unscale: bool = True
):
    """Handle tile requests."""
    dataset = f'{GCS_BASE}/{dataset}'
    cm = cmap.get(color)
    options={"unscale":unscale}
    with Reader(dataset, options=options) as cog:
        # print(cog.info())
        img = cog.tile(x, y, z)
    img.rescale(
        in_range=((0, max_val),),
        out_range=((0, 255),)
    )
    content = img.render(img_format="PNG", colormap=cm, **img_profiles.get("png"))
    return Response(content, media_type="image/png")

@app.get('/')
def test():
    return 'OK'

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080) 
# x = xr.open_dataset(ghsl)
# x.band_data.isel(band=0).chunk(1000).to_zarr("GHSL_COG.zarr")
# x.band_data.isel(band=0).chunk(100).rio.to_raster("GHSL_COG.tif", driver="COG")
