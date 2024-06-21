# This script is run with GDAL 3.7.1
# It converts layers in a FileGDB into efficiently compressed GeoTiffs
IN_DIR=/Users/chlowrie/Desktop/UCSC/GlobalFloodExplorer/data/GlobalMangroves/as_tiff
OUTPUT_DIR=/Users/chlowrie/Desktop/UCSC/GlobalFloodExplorer/data/GlobalMangroves/difference

layers=$(ls $IN_DIR*.tiff)
echo $layers
for rp in 010 025 050 100
do
    echo $rp
    with=$IN_DIR/with2010_TWL_TC_Tr_${rp}.tiff
    without=$IN_DIR/without_TWL_TC_Tr_${rp}.tiff
    gdal_calc.py -A $with -B $without --calc "A-B" --outfile $OUTPUT_DIR/difference_TWL_TC_TR_$rp.tiff
    # IFS='/' read -ra ADDR <<< "$layer"
    # layer_name=$(echo ${ADDR[${#ADDR[@]}-1]} | sed 's/"//') 
    # echo $layer_name
    # gdal_translate \
    #     -ot Int16 \
    #     -of COG \
    #     -scale 0 8 0 32767 \
    #     ${IN_DIR}${layer_name} ${OUTPUT_DIR}${layer_name} \
    #     -co NUM_THREADS=ALL_CPUS
    # gdal_edit.py ${OUTPUT_DIR}${layer_name} -scale $(bc -l <<< "8/32767.0")
done
