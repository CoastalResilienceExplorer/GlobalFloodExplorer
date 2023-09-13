# This script is run with GDAL 3.7.1
# It converts layers in a FileGDB into efficiently compressed GeoTiffs
IN_GDB=../data/Global_Flood_Maps_Visualization.gdb
OUTPUT_DIR=../data/as_tiff

layers=$(gdalinfo -json $IN_GDB | jq .metadata.SUBDATASETS | jq 'with_entries(if (.key|test("NAME")) then ( {key: .key, value: .value } ) else empty end )' | jq 'to_entries[].value')
for layer in $layers
do
    IFS=':' read -ra ADDR <<< "$layer"
    layer_name=$(echo ${ADDR[2]} | sed 's/"//')
    echo $layer_name
    gdal_translate \
        -ot Int16 \
        -scale 0 8 0 32767 \
        OpenFileGDB:${IN_GDB}:${layer_name} ${OUTPUT_DIR}/${layer_name}.tiff \
        -co NUM_THREADS=ALL_CPUS \
        -co COMPRESS=DEFLATE -co PREDICTOR=2 -co BIGTIFF=YES -co SPARSE_OK=TRUE
    gdal_edit.py ${OUTPUT_DIR}/${layer_name}.tiff -scale $(bc -l <<< "8/32767.0")
done

