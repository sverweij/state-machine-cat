# Selecting a graph engine

Libraries from http://anvaka.github.io/graph-drawing-libraries/#/all

Handy samples:
https://github.com/anvaka/graph-drawing-libraries/tree/master/src/src/scripts/examples

| Library            | score           | notes                                                                                                                                                  |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| d3                 | :question:      | low level (e.g. needs coordinates of states to be pre-calculated). Last resort. Force layout looks fine - not sure we can put text in the nodes easily |
| sigmajs            | :thumbsdown:    | canvas/ webg renderers. For svg: roll your own                                                                                                         |
| vis                | :thumbsdown:    | Network layout looks promising. Haven't seen svg rendition, though - looks like canvas only.                                                           |
| cytocscape         | :thumbsdown:    | Canvas only.                                                                                                                                           |
| arbor              | :question:      | no rendering, just calculations. Maybe useful i.c.w. d3                                                                                                |
| vivagraph & ngraph | :grey_question: | hmm                                                                                                                                                    |
| springy            | :thumbsdown:    | Last update: 12-2014. calculations only.                                                                                                               |
| dagre/ dagreD3     | :thumbsdown:    | 'not actively maintained'. calculations only. Recommends d3 as rendering back end for svg (and other methods).                                         |
| dracula            | :thumbsup:      | Looks aok. svg with raphael                                                                                                                            |
| JSNetworkX         | :grey_question: | port of a python library.                                                                                                                              |
| alchemy            | :thumbsdown:    | last update: 6-2015. 'looking for a maintainer'. Doing the layout - uses d3                                                                            |

| Criterium                                        | weight |
| ------------------------------------------------ | ------ |
| Runs in evergreen browsers                       | must   |
| Runs in node without clunky helpers like phantom | should |
| Renders to svg                                   | must   |
| Runs in elder browsers                           | nice   |
| active community/ regular updates                | should |
| Dot support                                      | nice   |
