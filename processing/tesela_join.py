import geopandas as gpd


root = '/Users/chlowrie/Downloads/023_cwon_data_teselas/RESULTS_BY_COUNTRY/RESULTS_COUNTRY_'
datasets = {
    year: gpd.read_file(f'{root}{year}.shp').reset_index().rename(columns={"index": "fid"})
    for year in ['1996', '2010', '2015', '2020']
}

gdf = datasets['1996'].merge(
    datasets['2010'],
    on=['fid', 'ISO3', 'geometry'],
    suffixes=['_1996', '_2010']
).merge(
    datasets['2015'],
    on=['fid', 'ISO3', 'geometry'],
    suffixes=['', '_2015']
).merge(
    datasets['2020'],
    on=['fid', 'ISO3', 'geometry'],
    suffixes=['', '_2020']
)

import pycountry
def convert_iso3_to_country_name(iso3):
    try:
        return pycountry.countries.get(alpha_3=iso3).name
    except AttributeError:
        return iso3
gdf['Country'] = gdf['ISO3'].apply(convert_iso3_to_country_name)


gdf = gdf.rename(columns={i: f'{i}_2015' for i in ['Mang_Ha', 'Risk_Pop', 'Risk_Stock', 'Ben_Pop', 'Ben_Stock']})
print(gdf)
print(gdf.shape)
print(gdf.columns)
gdf.to_file('/Users/chlowrie/Downloads/023_cwon_data_teselas/RESULTS_BY_COUNTRY/CWON_RESULTS_COUNTRY_ALLYEARS.gpkg')
# gdf.to_parquet('/Users/chlowrie/Downloads/023_cwon_data_teselas/RESULTS_BY_TESELA/CWON_RESULTS_TESELA_ALLYEARS.parquet')

# gdf['geometry'] = gdf.geometry.representative_point()
# gdf.to_parquet('/Users/chlowrie/Downloads/023_cwon_data_teselas/RESULTS_BY_TESELA/CWON_RESULTS_TESELA_ALLYEARS_RepPt.parquet')

