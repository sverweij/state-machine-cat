# State Machine Cat and XMI

As of version 6.0.0 state-machine-cat _does not support_
XMI ([XML Metadata Interchange](https://www.omg.org/spec/XMI))
as an output format anymore.

## Why was XMI support removed?

Various reasons:

- XMI is a gnarly format which takes a lot of effort to do well. I don't use it,
  and the use in other contexts eludes me. On top each supplier implements a
  different flavor, so xmi created with one tool will look like something hit by
  a truck in another. If it works at all, that is.

- state-machine-cat already supports [SCXML](./SCXML.md) - both as an input
  as an output format. It is well defined, and a standard that is a joy to
  implement (as far as standards go :-)).

- Instead of spending time on maintaining xmi support, I'd rather work on features
  for state-machine-cat that do add value, like an alternative graphical output
  or support for [xstate](https://github.com/davidkpiano/xstate).

- The packaged code will be smaller now - and the test suite will run faster
  (with ~ 65 xmi specific tests less).
