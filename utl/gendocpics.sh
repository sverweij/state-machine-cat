#!/bin/sh
DIR=doc/pics
bin/stategenny -T dot -o - $DIR/sample.stategenny | dot -Tpng -o$DIR/sample.png
bin/stategenny -T dot -o - $DIR/00simplest.stategenny | dot -Tpng -o$DIR/00simplest.png
bin/stategenny -T dot -o - $DIR/01labels.stategenny | dot -Tpng -o$DIR/01labels.png
bin/stategenny -T dot -o - $DIR/02notes.stategenny | dot -Tpng -o$DIR/02notes.png
bin/stategenny -T dot -o - $DIR/03initial_and_final.stategenny | dot -Tpng -o$DIR/03initial_and_final.png
bin/stategenny -T dot -o - $DIR/04explicit_state_declarations.stategenny | dot -Tpng -o$DIR/04explicit_state_declarations.png


optipng $DIR/*.png
DIR=
