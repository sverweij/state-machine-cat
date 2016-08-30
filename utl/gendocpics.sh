#!/bin/sh
DIR=doc/pics
bin/stategenny -T dot -o - $DIR/sample.stategenny | circo -Tpng -o$DIR/sample.png
bin/stategenny -T dot -o - $DIR/00simplest.stategenny | circo -Tpng -o$DIR/00simplest.png
bin/stategenny -T dot -o - $DIR/01labels.stategenny | circo -Tpng -o$DIR/01labels.png
bin/stategenny -T dot -o - $DIR/01labels_better.stategenny | dot -Tpng -o$DIR/01labels_better.png
bin/stategenny -T dot -o - $DIR/02notes.stategenny | dot -Tpng -o$DIR/02notes.png
bin/stategenny -T dot -o - $DIR/03initial_and_final.stategenny | circo -Tpng -o$DIR/03initial_and_final.png
bin/stategenny -T dot -o - $DIR/04explicit_state_declarations.stategenny | circo -Tpng -o$DIR/04explicit_state_declarations.png


optipng $DIR/*.png
DIR=
