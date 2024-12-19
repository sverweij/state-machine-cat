## Why does this renderer use `#FFFFFF01` instead of `transparent` for transparency?

Typically you'll use the `dot` output to translate it to scalable vector graphics
(svg) with GraphViz. In svg `transparent` isn't a color, though (see issue [#129](https://github.com/sverweij/state-machine-cat/issues/129)).
In web browsers this isn't a problem, but less lenient svg interpreters will
render it as black instead. This is suboptimal.

The obvious alternative is to use `#FFFFFF00` (as svg does allow RGBA), however
GraphViz translates this into `transparent` nonetheless. So to hack around this
the dot renderer uses `01` in the alpha channel in stead (`#FFFFFF01`). GrapViz
nicely translates this to `fill="#ffffff" fill-opacity="0.004"` which is sufficiently
transparent for all practical purposes.
