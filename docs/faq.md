### <a id="node12"></a>Q: I'm on node 12 and get a warning when I convert to svg with the cli. What's up?

**A**: On Node.js 12 you might see a warning message on stderr:
_Invalid asm.js: Function definition doesn't match use_.
It's a [known issue](https://github.com/mdaines/viz.js/issues/96) in viz.js,
the graph render library state-machine-cat uses.
The message is harmless and the rendered svg will come out just
fine, but know we're looking into alternatives.
