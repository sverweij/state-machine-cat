#!/bin/sh
rm -f test/render/fixtures/*.json
rm -f test/render/fixtures/*.scjson
rm -f test/render/fixtures/*.scxml
rm -f test/render/fixtures/*.svg
rm -rf test/render/fixtures/scxml/
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T json  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T scjson  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T scxml  {} ";" & \
find -X test/parse/fixtures/color-*.smcat -exec bin/smcat.mjs -T json  {} ";" & \
find -X test/parse/fixtures/no-color-*.smcat -exec bin/smcat.mjs -T json  {} ";" & \
find -X test/parse/fixtures/no-color-*.smcat -exec bin/smcat.mjs -T dot --dot-node-attrs "color=pink"  {} ";" & \
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T oldsvg  {} ";"
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T oldps2  {} ";"
find -X test/render/fixtures/*.smcat -exec bin/smcat.mjs -T oldeps  {} ";"
mkdir -p test/render/fixtures/scxml
find -X test/render/fixtures/*.scxml -exec bin/smcat.mjs -I scxml -T json {} -o {}.re-json ";"
bin/smcat.mjs -T json test/parse/fixtures/composite.smcat
bin/smcat.mjs -T dot test/parse/fixtures/composite.smcat
bin/smcat.mjs -T dot --direction bottom-top test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-bottom-top.dot
bin/smcat.mjs -T dot --direction left-right test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-left-right.dot
bin/smcat.mjs -T dot --direction right-left test/parse/fixtures/composite.smcat -o test/parse/fixtures/composite-right-left.dot
bin/smcat.mjs -T json test/parse/fixtures/composite_no_root_transitions.smcat
bin/smcat.mjs -T dot test/parse/fixtures/composite_no_root_transitions.smcat
bin/smcat.mjs -T json test/parse/fixtures/kitchensink.smcat
bin/smcat.mjs -T dot test/parse/fixtures/kitchensink.smcat
bin/smcat.mjs -T json test/parse/fixtures/minimal.smcat
bin/smcat.mjs -T dot test/parse/fixtures/minimal.smcat
bin/smcat.mjs -T dot test/parse/fixtures/pseudostates.smcat
bin/smcat.mjs -T json test/parse/fixtures/pseudostates.smcat
bin/smcat.mjs -T dot test/parse/fixtures/parallel-with-non-regular-child.smcat
bin/smcat.mjs -T json test/parse/fixtures/parallel-with-non-regular-child.smcat
bin/smcat.mjs -T dot --direction top-down test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-top-down.dot
bin/smcat.mjs -T dot --direction bottom-top test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-bottom-top.dot
bin/smcat.mjs -T dot --direction left-right test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-left-right.dot
bin/smcat.mjs -T dot --direction right-left test/parse/fixtures/pseudostates.smcat -o test/parse/fixtures/pseudostates-right-left.dot
bin/smcat.mjs -T json test/parse/fixtures/compositewithselftransition.smcat
bin/smcat.mjs -T dot --direction top-down test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-top-down.dot
bin/smcat.mjs -T dot --direction bottom-top test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-bottom-top.dot
bin/smcat.mjs -T dot --direction left-right test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-left-right.dot
bin/smcat.mjs -T dot --direction right-left test/parse/fixtures/compositewithselftransition.smcat -o test/parse/fixtures/compositewithselftransition-right-left.dot
bin/smcat.mjs -T dot test/parse/fixtures/states-with-a-label.smcat
bin/smcat.mjs -T json test/parse/fixtures/states-with-a-label.smcat
npm run lint:fix:prettier
