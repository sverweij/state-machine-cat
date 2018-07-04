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
bin/smcat -d left-right -T dot -o - $DIR/08parallel.smcat | dot -Gdpi=192 -Tpng -o$DIR/08parallel.png
bin/smcat -d left-right -T dot -o - $DIR/09labeled_states.smcat | dot -Gdpi=192 -Tpng -o$DIR/09labeled_states.png
bin/smcat -d left-right -T dot -o - $DIR/on-off.smcat | dot -Gdpi=192 -Tpng -o$DIR/on-off-left-right.png

bin/smcat -d left-right -T dot -o - $DIR/desugar-01-join-desugared.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-01-desugared.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-01-join.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-01-join.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-02-fork-desugared.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-02-fork-desugared.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-02-fork.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-02-fork.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-03-junction-desugared.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-03-junction-desugared.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-03-junction.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-03-junction.png
bin/smcat -T dot -o - $DIR/desugar-04-choice-desugared.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-04-choice-desugared.png
bin/smcat -T dot -o - $DIR/desugar-04-choice.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-04-choice.png
bin/smcat -d left-right -T dot -o - $DIR/desugar-05-initial.smcat | dot -Gdpi=192 -Tpng -o$DIR/desugar-05-initial.png

optipng $DIR/*.png
DIR=
