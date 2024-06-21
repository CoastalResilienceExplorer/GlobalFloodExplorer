# This script is run with GDAL 3.7.1
# It converts layers in a FileGDB into efficiently compressed GeoTiffs
IN_DIR=/Users/chlowrie/Downloads/OPC_tifs/
OUTPUT_DIR=/Users/chlowrie/Downloads/OPC_tifs/minified/

layers=$(ls $IN_DIR*.tif)
echo $layers
for layer in `ls $IN_DIR*.tif`
do
    echo $layer
    IFS='/' read -ra ADDR <<< "$layer"
    layer_name=$(echo ${ADDR[${#ADDR[@]}-1]} | sed 's/"//') 
    echo $layer_name
    gdal_translate \
        -ot Int16 \
        -of COG \
        -scale 0 8 0 32767 \
        ${IN_DIR}${layer_name} ${OUTPUT_DIR}${layer_name} \
        -co NUM_THREADS=ALL_CPUS
    gdal_edit.py ${OUTPUT_DIR}${layer_name} -scale $(bc -l <<< "8/32767.0")
done
