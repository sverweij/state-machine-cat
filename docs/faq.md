### <a id="viz"></a>Q: I get a warning when I convert to svg with the cli. What's up?

**A**: You might see a warning message on stderr:
_Invalid asm.js: Function definition doesn't match use_.

This happens with state-machine-cat < v11.0.1 can't find a graphviz dot executable.
In these cases it fell back to [viz.js](https://github.com/mdaines/viz.js),
a GraphViz version compiled to javascript. One of viz.js'
[known issues](https://github.com/mdaines/viz.js/issues/96) is that it triggers
this scary looking error message in the node runtime. It's harmless and the
svg will come out just fine.

If you want to get rid of the message:

- Upgrade to state-machine-cat >= 11.0.1, which uses @hpcc-js/wasm/graphviz as a
  fallback in stead of viz.js
- install GraphViz dot and ensure it's available in your environments' `path`.
  GrapViz is readily available on all platforms nodejs runs on e.g.
  - for debian derivatives like ubuntu: `apt install graphviz`
  - for macOS, using homebrew: `brew install graphviz`

For other platforms please refer to the [GraphViz website's download section](https://graphviz.gitlab.io/download/)

### <a id="noderministic"></a>Q: for (especially nested) graphs the graphical output varies while I've changed noting in the source (smcat). How come?

For some types of graphs GraphViz (the engine we use to render the graphs) is
non-deterministic. The graph will always be _correct_, but it might show up with
slight variations. See
[clustering gives undeterministic results](https://forum.graphviz.org/t/clustering-gives-undeterministic-results/989)
on the GraphViz forum for details.
