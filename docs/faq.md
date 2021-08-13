### <a id="viz"></a>Q: I get a warning when I convert to svg with the cli. What's up?

**A**: You might see a warning message on stderr:
_Invalid asm.js: Function definition doesn't match use_.

This happens when state-machine-cat can't find a graphviz dot executable. In
these cases it falls back to [viz.js](https://github.com/mdaines/viz.js),
a graphviz version compiled to javascript. One of viz.js'
[known issues](https://github.com/mdaines/viz.js/issues/96) is that it triggers
this scary looking error message in the node runtime. It's harmless and the
svg will come out just fine.

If you want to get rid of the message install GraphViz dot and ensure it's
available in your environments' `path`. GrapViz is readily available on all
platforms nodejs runs on e.g.

- for debian derivatives like ubuntu: `apt install graphviz`
- for macOS, using homebrew: `brew install graphviz`

For other platforms please refer to the [GraphViz website's download section](https://graphviz.gitlab.io/download/)
