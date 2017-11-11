# State machine cat - API

If you want to integrate state-machine-cat in your own application in some way,
there is an API. All three ways to work with state-machine-cat (command line,
website and atom package) already use it.

> Make sure that if you integrate state-machine-cat into your software, your
> software respects state-machine-cat's license, which is the GNU General Public
> License version 3.

## Basic use

```javascript
const smcat = require("state-machine-cat");

smcat.render(
    `
        initial => backlog;
        backlog => doing;
        doing => test;
    `,
    {
        outputType: "svg"
    },
    (pError, pSuccess) => console.log(pError || pSuccess)
);
```

## Public API
### `render (script, options, callback)`
The main render function. It parses and renders the _smcat_ `script` you pass
it, talking any `options` into account and calling `callback` with the results.

#### script
A string containing the script you want to get rendered. This is typically in
the _smcat_ language (see the
[readme](https://github.com/sverweij/state-machine-cat/blob/master/README.md)
for details), but you if you pass "json" to the `inputType` option, `render`
will expect an abstract syntax tree of a state machine.

#### callback
A function. When `render` is done it will call this
function with two parameters:
- the first will contain `null` if render completed successfully, and an
  `Error` object in all other cases.
- The second parameter contains the result of the rendition if the render
  completed successfully (and `undefined` in all other cases.)

#### options
An object, with attributes to steer the behaviour of the render function. you
can get the actual list of the options you can pass and their allowed values
from the `smcat.getAllowedValues()` function below, so you don't have to hard
code the parameters or the values you can pass them.

At the time of writing the API does _no validation_ on the values of these
options. Instead it expects the caller to sanitize and validate them before
calling it. The `smcat.getAllowedValues()` will simplify that, but despite
this I'm thinking of moving the validations behind the API anyway somewhere
in the future.

##### options.inputType
How to interpret the `script` parameter. Defaults to `smcat` - which means
`render` will expect `script` to be in the _smcat_ language.

Allowed values: call `smcat.getAllowedValues().inputType`

##### options.outputType
The type of output to emit when parsing and rendering was successful. Defaults
to "svg".

Allowed values: call `smcat.getAllowedValues().outputType`

##### options.direction
The direction to render the states in. Only makes sense when the output is a
graph, so it only works for outputTypes `dot` and `svg`.

Allowed values: call `smcat.getAllowedValues().direction`

##### options.engine
The GraphViz engine to use to convert `dot` to `svg`. This defaults to `dot`
which in the vast majority of cases will yield the best results.

Allowed values: call `smcat.getAllowedValues().engine`

### `smcat.getAllowedValues()`
Returns an object with all the possible options, and for each option an
array of possible values. It'll typically look like this:

```javascript
{
    inputType: [
        {name: "smcat", experimental: false},
        {name: "json",  experimental: false}
    ],
    outputType: [
        {name: "smcat", experimental: false},
        {name: "dot",   experimental: false},
        {name: "json",  experimental: false},
        {name: "ast",   experimental: false},
        {name: "svg",   experimental: false},
        {name: "html",  experimental: false}
    ],
    engine: [
        {name: "dot",    experimental: false},
        {name: "circo",  experimental: false},
        {name: "fdp",    experimental: false},
        {name: "neato",  experimental: false},
        {name: "osage",  experimental: false},
        {name: "twopi",  experimental: false}
    ],
    direction: [
        {name: "top-down",   experimental: true},
        {name: "left-right", experimental: true}
    ]
}
```

### `smcat.version`
The current version of the state-machine-cat package as a
[semver](https://semver.org) compliant string.
