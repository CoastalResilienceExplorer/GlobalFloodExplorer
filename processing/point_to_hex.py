import geopandas as gpd
from shapely.geometry import Point, Polygon
import argparse
import math
import os

def create_hexagon_polygon(center, size):
    """
    Create a hexagon polygon given the center and size.

    Parameters:
    - center: Tuple representing the (x, y) coordinates of the hexagon center.
    - size: Size of the hexagon.

    Returns:
    - shapely.geometry.Polygon
    """
    angles = [i * math.pi / 180 for i in  [0, 60, 120, 180, 240, 300]]
    hexagon_coords = [
        (center[0] + size * math.cos(angle), 
         center[1] + size * math.sin(angle)) 
         for angle in angles]
    return Polygon(hexagon_coords)

def convert_points_to_hexagons(points, hexagon_size):
    """
    Convert a GeoDataFrame of points to a GeoDataFrame of hexagons.

    Parameters:
    - points: GeoDataFrame with point geometries.
    - hexagon_size: Size of the hexagons.

    Returns:
    - GeoDataFrame with hexagon geometries.
    """
    hexagons = []
    for _, point in points.iterrows():
        hexagon = create_hexagon_polygon((point.geometry.x, point.geometry.y), hexagon_size)
        hexagons.append(hexagon)
    
    points.geometry = hexagons
    return points

def main():
    parser = argparse.ArgumentParser(description='Convert points from a shapefile to hexagon polygons.')
    parser.add_argument('input', type=str, help='Path to the shapefile containing points.')

    args = parser.parse_args()

    # Read points from shapefile
    points_gdf = gpd.read_parquet(args.input)

    # Set hexagon size
    hexagon_size = 0.03  # Adjust the size as needed

    # Convert points to hexagons
    hexagons_gdf = convert_points_to_hexagons(points_gdf, hexagon_size)
    hexagons_gdf.to_file(os.path.join('/'.join(args.input.split('/')[0:-1]), 'are_they_hexagons.gpkg'))
    hexagons_gdf.to_parquet(args.input.replace('_RepPt', '_hex')) 
    # Plotting
    # fig, ax = plt.subplots()
    # points_gdf.plot(ax=ax, color='red', marker='o', label='Points')
    # hexagons_gdf.plot(ax=ax, facecolor='none', edgecolor='blue', label='Hexagons')
    # plt.legend()
    # plt.savefig('/data/are_they_hexagons.png')

if __name__ == "__main__":
    main()
