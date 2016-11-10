![doc/sample.png](doc/pics/smcat-small.png)
# State Machine cat
*smcat turns your text into state charts*

[![build status](https://gitlab.com/sverweij/state-machine-cat/badges/master/build.svg)](https://gitlab.com/sverweij/state-machine-cat/builds)
[![coverage report](https://gitlab.com/sverweij/state-machine-cat/badges/master/coverage.svg)](https://gitlab.com/sverweij/state-machine-cat/builds)
[![npm stable version](https://img.shields.io/npm/v/state-machine-cat.svg)](https://npmjs.com/package/state-machine-cat)
[![GPLv3 licensed](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](https://gitlab.com/sverweij/state-machine-cat/blob/master/COPYING)

## What?
Makes this

![doc/sample.png](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/sample.png)

from this
```smcat
initial,
doing: entry/ write unit test
       do/ write code
       exit/ ...,
# smcat recognizes initial
# and final states by name
# and renders them appropriately
final;

initial      => "on backlog" : item adds most value;
"on backlog" => doing        : working on it;
doing        => testing      : built & unit tested;
testing      => "on backlog" : test not ok;
testing      => final        : test ok;
```

## Why
To enable me to make state charts ...
- ... that look _good_
- ... with the least effort possible
- ... whithout having to interact with drag and drop tools. Entering text
  is fine, doing my own layout is not.
- ... without having to dive into GraphViz `dot` each time. GraphViz is cool,
  but is was not designed to write & maintain conceptual documents in
  (_You'll know what I'm talking about if you ever tried to get it to draw nested nodes. Or edges between those._ )

## Usage

### On line
A no-frills interpreter on line: [sverweij.gitlab.io/state-machine-cat](https://sverweij.gitlab.io/state-machine-cat).

### Within the Atom editor
There's an [Atom package](https://atom.io/packages/state-machine-cat-preview)
with syntax highlighting, a previewer and some export options. You can install
it from within Atom (search for _state machine cat_ in the _install_ section
of the settings screen) or use `apm i state-machine-cat-preview`
if you're a command line person.

OTOH. if you're a command line person the _command line interface_ might be
something for you too:

### Command line interface
Just `npm install --global state-machine-cat` and run `smcat`

This is what `smcat --help` would get you:

```
Usage: smcat [options] [infile]

Options:

  -h, --help               output usage information
  -V, --version            output the version number
  -T --output-type <type>  smcat|dot|json|ast|svg. Default: svg
  -I --input-type <type>   smcat|json. Default: smcat
  -E --engine <type>       dot|circo|fdp|neato|osage|twopi. Default: dot
  -i --input-from <file>   File to read from. use - for stdin.
  -o --output-to <file>    File to write to. use - for stdout.
  -l --license             Display license and exit
```

... so to convert the above chart to `sample.svg`

```sh
bin/smcat doc/sample.smcat
```

Or, if you'd rather have the native GraphViz dot do that for you:

```sh
bin/smcat -T dot doc/sample.smcat -o - | dot -T svg -odoc/sample.svg
```

Leaving the options at the default settings usually deliver the best
results already, so if they bewilder you: don't worry.

### Programmatically
After you `npm i` 'd `state-machine-cat`:

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

## The language

### Short tutorial

#### simplest
```smcat
on => off;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/00simplest.png)

- _smcat_ automatically declares the states. You _can_ explicitly declare
  them if you want them to have more than a name only - see _explicit state
  declarations_ below.

#### labels
```smcat
on => off: switch;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/01labels.png)

UML prescribes to place _conditions_ after _events_, to place
_conditions_ within squares and to place actions
after a `/`: `on => off: switch flicked [not an emergency]/ light off;`.

You're free to do so, but _smcat_ doesn't check for it. It might take
the notation into account somewhere in the future (although I see no reason
to make it mandatory).
```smcat
on => off: switch flicked/
           light off;
off => on: switch flicked/
           light on;
```

![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/01labels_better.png)
#### notes
```smcat
# this is a note
on => off;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/02notes.png)

#### explicit state declarations
```smcat
# yep, notes get rendered here as well
# multiple notes translate into multiple
# lines in notes in the diagram
doing: pick up
       ...;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/04explicit_state_declarations.png)


#### `initial` and `final`
When you name a state `initial` or `final`, _smcat_ treats them as
the UML 'pseudo states' for inital and final:
```smcat
initial => todo;
todo    => doing;
doing   => done;
done    => final;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/03initial_and_final.png)

#### Choice - `^`
_smcat_ treats states starting with `^` as UML pseudo state _choice_. Strictly
speaking 'choice' is a superfluous element of the UML state machine
specification, but it is there and sometimes it makes diagrams easier to read.

```smcat
^fraud?: transaction fraudulent?;

initial -> reserved;
reserved -> quoted:
    quote
    requested;
quoted -> ^fraud?: payment;
^fraud? -> ticketed: [no];
^fraud? -> removed: [yes];
ticketed -> final;
removed -> final;
```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/03achoice.png)

#### Forks and joins  - `]`
In UML you can fork state transitions into multiple or join them into one
with the _fork_ and _join_ pseudo states. Both of them are represented by
a black bar. To make a _join_ or _fork_ pseudo state, start its name with a `]`.
Here's an example of a _join_:

```smcat
a => ]join;
b => ]join;
]join => c;
```

![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/03bforkjoin.png)



#### Gotchas
- when you need `;`, `,`, `{` or spaces as part of a state - place em in quotes
    `"a state"`
- Activities have the same restriction, except they allow spaces.
- Labels have the same restriction as activities, except they allow for `,` too.
- State declaration precedence is: deep wins from shallow; explicit wins from
  implicit
- It's possible to declare the same state multiple times on the same level, buts
  smcat will take the last declaration into account only. For example:

This
```
# first declaration of "cool state"
"cool state",
"other state",
# second declaration of "cool state"
"cool state": cool down;
```
results in (/ is equivalent to):
```
# second declaration of "cool state"
"cool state": cool down,
"other state";
```

#### nested state machines
It's possible to have state machines _within_ states.
the states _stopped_, _playing_ and _pause_ can only occur when
the tape player is on:
```
initial,
"tape player off",
"tape player on" {
  stopped => playing : play;
  playing => stopped : stop;
  playing => paused  : pause;
  paused  => playing : pause;
  paused  => stopped : stop;
};

initial           => "tape player off";
"tape player off" => stopped           : power;
"tape player on"  => "tape player off" : power;

```
![rendition](https://gitlab.com/sverweij/state-machine-cat/raw/master/doc/pics/05tape_player.png)

#### grammar
I made the parser with pegjs - you can find it at
[src/parse/peg/smcat-parser.pegjs](src/parse/peg/smcat-parser.pegjs)

## Status
- Thoroughly tested and good enough for public use.
- Despite this you might bump into the occasional issue - don't hesitate to
  report it, either on [GitLab](https://gitlab.com/sverweij/state-machine-cat/issues)
  or on [GitHub](https://github.com/sverweij/state-machine-cat/issues).
- It's also an 1.x.x version - so I might change some things around (always
  respectful of the _semantic versioning_ guidelines).
