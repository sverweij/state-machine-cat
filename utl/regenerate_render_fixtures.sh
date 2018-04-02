rm -f test/render/fixtures/*.json
rm -f test/render/fixtures/*.scjson
rm -f test/render/fixtures/*.scxml
rm -f test/render/fixtures/*.svg
find -X test/render/fixtures/*.smcat -exec bin/smcat -T json  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat -T scjson  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat -T scxml  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat -T svg  {} ";"
