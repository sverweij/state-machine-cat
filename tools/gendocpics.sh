#!/bin/sh
set -e
DIR=docs/pics
find -X docs/pics/types/*.smcat -exec dist/cli/main.mjs -T dot {} ";"
find -X docs/pics/types/*.dot -exec dot -Gdpi=192 -Tpng {} -O ";"
rm docs/pics/types/*.dot
dist/cli/main.mjs -T dot -o - $DIR/sample.smcat | circo -Gdpi=192 -Tpng -o$DIR/sample.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/00simplest.smcat | dot -Gdpi=192 -Tpng -o$DIR/00simplest.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/01labels.smcat | dot -Gdpi=192 -Tpng -o$DIR/01labels.png
dist/cli/main.mjs -T dot -o - $DIR/01labels_better.smcat | dot -Gdpi=192 -Tpng -o$DIR/01labels_better.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/02notes.smcat | dot -Gdpi=192 -Tpng -o$DIR/02notes.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/03initial_and_final.smcat | dot -Gdpi=192 -Tpng -o$DIR/03initial_and_final.png
dist/cli/main.mjs -T dot -o - $DIR/03achoice.smcat | circo -Gdpi=192 -Tpng -o$DIR/03achoice.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/03bforkjoin.smcat | dot -Gdpi=192 -Tpng -o$DIR/03bforkjoin.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/03cjunction.smcat | dot -Gdpi=192 -Tpng -o$DIR/03cjunction.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/03dterminate.smcat | dot -Gdpi=192 -Tpng -o$DIR/03dterminate.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/04explicit_state_declarations.smcat | dot -Gdpi=192 -Tpng -o$DIR/04explicit_state_declarations.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/05tape_player.smcat | dot -Gdpi=192 -Tpng -o$DIR/05tape_player.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/07history.smcat | dot -Gdpi=192 -Tpng -o$DIR/07history.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/08parallel.smcat | dot -Gdpi=192 -Tpng -o$DIR/08parallel.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/09labeled_states.smcat | dot -Gdpi=192 -Tpng -o$DIR/09labeled_states.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/10colored_states_and_transitions.smcat | circo -Gdpi=192 -Tpng -o$DIR/10colored_states_and_transitions.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/11active_state.smcat | dot -Gdpi=192 -Tpng -o$DIR/11active_state.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/12state_type_overrides_not_overridden.smcat | dot -Gdpi=192 -Tpng -o$DIR/12state_type_overrides_not_overridden.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/12state_type_overrides.smcat | dot -Gdpi=192 -Tpng -o$DIR/12state_type_overrides.png
dist/cli/main.mjs -d left-right -T dot -o - $DIR/on-off.smcat | dot -Gdpi=192 -Tpng -o$DIR/on-off-left-right.png

dist/cli/main.mjs -d top-down -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-01-join.smcat | dot -Tpng -o$DIR/desugar-01-join.png
dist/cli/main.mjs -d top-down -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-01-join-desugared.smcat | dot -Tpng -o$DIR/desugar-01-join-desugared.png
dist/cli/main.mjs -d top-down -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-02-fork.smcat | dot -Tpng -o$DIR/desugar-02-fork.png
dist/cli/main.mjs -d top-down -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-02-fork-desugared.smcat | dot -Tpng -o$DIR/desugar-02-fork-desugared.png
dist/cli/main.mjs -d left-right -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-03-junction.smcat | dot -Tpng -o$DIR/desugar-03-junction.png
dist/cli/main.mjs -d left-right -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-03-junction-desugared.smcat | dot -Tpng -o$DIR/desugar-03-junction-desugared.png
dist/cli/main.mjs -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-04-choice.smcat | dot -Tpng -o$DIR/desugar-04-choice.png
dist/cli/main.mjs -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-04-choice-desugared.smcat | dot -Tpng -o$DIR/desugar-04-choice-desugared.png
dist/cli/main.mjs -d left-right -T dot -o - --dot-graph-attrs "dpi=192" $DIR/desugar-05-initial.smcat | dot -Tpng -o$DIR/desugar-05-initial.png

optipng $DIR/*.png
optipng $DIR/types/*.png
DIR=
