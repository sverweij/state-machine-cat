#!/bin/sh
DIR=docs/pics
bin/smcat -T dot -o - $DIR/sample.smcat | circo -Tpng -o$DIR/sample.png
bin/smcat -d left-right -T dot -o - $DIR/00simplest.smcat | dot -Tpng -o$DIR/00simplest.png
bin/smcat -d left-right -T dot -o - $DIR/01labels.smcat | dot -Tpng -o$DIR/01labels.png
bin/smcat -T dot -o - $DIR/01labels_better.smcat | dot -Tpng -o$DIR/01labels_better.png
bin/smcat -d left-right -T dot -o - $DIR/02notes.smcat | dot -Tpng -o$DIR/02notes.png
bin/smcat -d left-right -T dot -o - $DIR/03initial_and_final.smcat | dot -Tpng -o$DIR/03initial_and_final.png
bin/smcat -T dot -o - $DIR/03achoice.smcat | circo -Tpng -o$DIR/03achoice.png
bin/smcat -d left-right -T dot -o - $DIR/03bforkjoin.smcat | dot -Tpng -o$DIR/03bforkjoin.png
bin/smcat -d left-right -T dot -o - $DIR/04explicit_state_declarations.smcat | dot -Tpng -o$DIR/04explicit_state_declarations.png
bin/smcat -d left-right -T dot -o - $DIR/05tape_player.smcat | dot -Tpng -o$DIR/05tape_player.png
bin/smcat -d left-right -T dot -o - $DIR/on-off.smcat | dot -Tpng -o$DIR/on-off-left-right.png
bin/smcat -d top-down -T dot -o - $DIR/on-off.smcat | dot -Tpng -o$DIR/on-off-top-down.png

optipng $DIR/*.png
DIR=
