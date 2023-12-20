import geopandas as gpd
import argparse
import os

root = '/data/RESULTS_TESELA_'
datasets = {
    year: gpd.read_file(f'{root}{year}.shp').reset_index().rename(columns={"index": "fid"})
    for year in ['1996', '2010', '2015', '2020']
}
print(datasets)

gdf = datasets['1996'].merge(
    datasets['2010'],
    on=['fid', 'X_centroid', 'Y_centroid', 'ISO3', 'geometry'],
    suffixes=['_1996', '_2010']
).merge(
    datasets['2015'],
    on=['fid', 'X_centroid', 'Y_centroid', 'ISO3', 'geometry'],
    suffixes=['', '_2015']
).merge(
    datasets['2020'],
    on=['fid', 'X_centroid', 'Y_centroid', 'ISO3', 'geometry'],
    suffixes=['', '_2020']
)

gdf = gdf.rename(columns={i: f'{i}_2015' for i in ['Mang_Ha', 'Risk_Pop', 'Risk_Stock', 'Ben_Pop', 'Ben_Stock']})
gdf.to_file('/data/UCSC_CWON_studyunits.gpkg')
SHDI = gpd.read_file('/data/SHDI_2015.gpkg')
SHDI = SHDI[['geometry', "GDL-Subnational-HDI-data_2015"]].rename(columns={"GDL-Subnational-HDI-data_2015": "SHDI_2015"})
SHDI.geometry = SHDI.geometry.simplify(0.001)
gdf_with_shdi = gdf.sjoin(SHDI, how='left')
# print(gdf_with_shdi)

# gdf_with_shdi['SHDI_2015'] = gdf_with_shdi['SHDI_2015'].fillna(-1)
# gdf_with_shdi['RN'] = gdf_with_shdi.groupby("fid")["SHDI_2015"].rank(method="first", ascending=True).fillna(1.0).astype(int)
# gdf_with_shdi = gdf_with_shdi[gdf_with_shdi["RN"] == 1]
# gdf_with_shdi = gdf_with_shdi.drop(columns=['index_right', 'RN'])

# gdf = gdf_with_shdi

# filename = "/data/CWON_combined_teselas.parquet"
# # remote_path = os.path.join(f"gs://geopmaker-output-staging", filename)
# gdf.to_parquet(filename)
# # If polygon, write the Rep Pts as well since those are generally useful.
# filename_pts = "/data/CWON_combined_teselas_reppts.parquet"
# # remote_path = os.path.join(f"gs://geopmaker-output-staging", filename_pts)
# gdf.geometry = gdf.geometry.representative_point()
# gdf.to_parquet(filename_pts)