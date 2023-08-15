from rio_tiler.io import Reader
import xarray as xr
import rioxarray as rxr
from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rio_tiler.profiles import img_profiles
from rio_tiler.colormap import cmap
import logging
log = logging.Logger('log')
log.setLevel(logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

ghsl = './ghsl_cog.tif'
cm = cmap.get("ylorrd")


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
    # url: str = Query(..., description="Cloud Optimized GeoTIFF URL."),
):
    """Handle tile requests."""
    with Reader(ghsl) as cog:
        img = cog.tile(x, y, z)
    img.rescale(
        in_range=((0, 10000),),
        out_range=((0, 255),)
    )
    content = img.render(img_format="PNG", colormap=cm, **img_profiles.get("png"))
    print(img.data)
    # return 200
    return Response(content, media_type="image/png")

@app.get('/')
def test():
    return 'OK'
# x = xr.open_dataset(ghsl)
# x.band_data.isel(band=0).chunk(1000).to_zarr("GHSL_COG.zarr")
# x.band_data.isel(band=0).chunk(100).rio.to_raster("GHSL_COG.tif", driver="COG")
