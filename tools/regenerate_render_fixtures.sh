#!/bin/sh
set -e
echo "1/6 removing old fixtures ..."
rm -f test/render/fixtures/*.json
rm -f test/render/fixtures/*.scjson
rm -f test/render/fixtures/*.scxml
rm -f test/render/fixtures/*.svg
rm -f test/render/fixtures/*.ps
rm -f test/render/fixtures/*.eps
rm -f test/render/fixtures/*.dot
rm -f test/render/fixtures/*.re-json
rm -rf test/render/fixtures/scxml/
mkdir -p test/render/fixtures/scxml

echo "2/6 re-generating svg, ps and eps graphviz can deterministally render ..."
find -X test/render/fixtures/*-d-*.smcat -exec dist/cli/main.mjs -T oldsvg  {} ";" & \
find -X test/render/fixtures/*-d-*.smcat -exec dist/cli/main.mjs -T oldps2  {} ";" & \
find -X test/render/fixtures/*-d-*.smcat -exec dist/cli/main.mjs -T oldeps  {} ";"

echo "3/6 re-generating render json, scjson, scxml and dot fixtures ..."
echo "    json"
find -X test/render/fixtures/*.smcat -exec dist/cli/main.mjs -T json  {} ";"
echo "    scjson"
find -X test/render/fixtures/*.smcat -exec dist/cli/main.mjs -T scjson  {} ";"
echo "    scxml"
find -X test/render/fixtures/*.smcat -exec dist/cli/main.mjs -T scxml  {} ";" 
echo "    dot"
find -X test/render/fixtures/*.smcat -exec dist/cli/main.mjs -T dot  {} ";" 
echo "    re-json"
find -X test/render/fixtures/*.scxml -exec dist/cli/main.mjs -I scxml -T json {} -o {}.re-json ";"

echo "4/6 re-generating parse fixtures ..."
find -X test/parse/fixtures/color-*.smcat -exec dist/cli/main.mjs -T json  {} ";"
find -X test/parse/fixtures/no-color-*.smcat -exec dist/cli/main.mjs -T json  {} ";"
find -X test/parse/fixtures/no-color-*.smcat -exec dist/cli/main.mjs -T dot --dot-node-attrs "color=pink"  {} ";"

echo "5/6 re-generating one-off parse fixtures ..."
dist/cli/main.mjs -T json test/parse/fixtures/composite.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/composite.smcat
dist/cli/main.mjs -T dot --direction bottom-top test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-bottom-top.dot
dist/cli/main.mjs -T dot --direction left-right test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-left-right.dot
dist/cli/main.mjs -T dot --direction right-left test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-right-left.dot
dist/cli/main.mjs -T json test/parse/fixtures/composite_no_root_transitions.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/composite_no_root_transitions.smcat
dist/cli/main.mjs -T json test/parse/fixtures/kitchensink.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/kitchensink.smcat
dist/cli/main.mjs -T json test/parse/fixtures/minimal.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/minimal.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/pseudostates.smcat
dist/cli/main.mjs -T json test/parse/fixtures/pseudostates.smcat
dist/cli/main.mjs -T dot test/parse/fixtures/parallel-with-non-regular-child.smcat
dist/cli/main.mjs -T json test/parse/fixtures/parallel-with-non-regular-child.smcat
dist/cli/main.mjs -T dot --direction top-down test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-top-down.dot
dist/cli/main.mjs -T dot --direction bottom-top test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-bottom-top.dot
dist/cli/main.mjs -T dot --direction left-right test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-left-right.dot
dist/cli/main.mjs -T dot --direction right-left test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-right-left.dot
dist/cli/main.mjs -T json test/parse/fixtures/compositewithselftransition.smcat
dist/cli/main.mjs -T dot --direction top-down test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-top-down.dot
dist/cli/main.mjs -T dot --direction bottom-top test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-bottom-top.dot
dist/cli/main.mjs -T dot --direction left-right test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-left-right.dot
dist/cli/main.mjs -T dot --direction right-left test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-right-left.dot
dist/cli/main.mjs -T dot test/parse/fixtures/states-with-a-label.smcat
dist/cli/main.mjs -T json test/parse/fixtures/states-with-a-label.smcat


echo "6/6 formatting results ..."
npm run format

echo "done"
