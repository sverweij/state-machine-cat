#!/bin/sh
DIR=docs/pics
bin/smcat -T dot -o - $DIR/sample.smcat | circo -Gdpi=192 -Tpng -o$DIR/sample.png
bin/smcat -d left-right -T dot -o - $DIR/00simplest.smcat | dot -Gdpi=192 -Tpng -o$DIR/00simplest.png
bin/smcat -d left-right -T dot -o - $DIR/01labels.smcat | dot -Gdpi=192 -Tpng -o$DIR/01labels.png
bin/smcat -T dot -o - $DIR/01labels_better.smcat | dot -Gdpi=192 -Tpng -o$DIR/01labels_better.png
bin/smcat -d left-right -T dot -o - $DIR/02notes.smcat | dot -Gdpi=192 -Tpng -o$DIR/02notes.png
bin/smcat -d left-right -T dot -o - $DIR/03initial_and_final.smcat | dot -Gdpi=192 -Tpng -o$DIR/03initial_and_final.png
bin/smcat -T dot -o - $DIR/03achoice.smcat | circo -Gdpi=192 -Tpng -o$DIR/03achoice.png
bin/smcat -d left-right -T dot -o - $DIR/03bforkjoin.smcat | dot -Gdpi=192 -Tpng -o$DIR/03bforkjoin.png
bin/smcat -d left-right -T dot -o - $DIR/04explicit_state_declarations.smcat | dot -Gdpi=192 -Tpng -o$DIR/04explicit_state_declarations.png
bin/smcat -d left-right -T dot -o - $DIR/05tape_player.smcat | dot -Gdpi=192 -Tpng -o$DIR/05tape_player.png
bin/smcat -d left-right -T dot -o - $DIR/07history.smcat | dot -Gdpi=192 -Tpng -o$DIR/07history.png
bin/smcat -d left-right -T dot -o - $DIR/on-off.smcat | dot -Gdpi=192 -Tpng -o$DIR/on-off-left-right.png

optipng $DIR/*.png
DIR=
