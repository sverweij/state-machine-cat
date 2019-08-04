# De-sugaring state machines

State machine cat supports the _choice_, _fork_, _join_ and _junction_
pseudo states from the UML state chart specification. They
make some state charts more readable, but in themselves
don't add to the expressive power of state charts. Each
of these pseudo elements can be expressed in _states_
and _transitions_.

> As from version 5.2.0 state-machine-cat's command line interface
> and api have a `--desugar` and `desugar` boolean resectively for
> de-sugaring.
> When switched on state-machine-cat performs a de-sugaring process
> for _join_ and _fork_ pseudo states as described below.
>
> The feature is experimental and in edge cases might yield state
> machines that aren't valid i.e. when forks (or joins) declared in
> lower levels are used in higher levels, e.g.
>
> ```smcat
> a {
>   aa => ]a;
>   ]a => ab;
>   ]a => ac;
> },
> b;
>
> ]a => b;
> ```
>
> It's an a-typical thing to do, but it _is_ possible, so if you use this
> you might want to move the pseudostate to a more logical spot before
> doing the de-sugaring.

## De-sugaring _join_

A _join_ is a pseudo-state that joins two or more parallel
_transitions_ into one.

<img width="326" alt="pics/desugar-01-join.png" src="pics/desugar-01-join.png"> => <img width="265" alt="pics/desugar-01-join-desugared.png" src="pics/desugar-01-join-desugared.png">

## De-sugaring _fork_

A _fork_ is a pseudo-state that forks a _transition_ into
more than one.

<img width="329" alt="pics/desugar-02-fork.png" src="pics/desugar-02-fork.png"> => <img width="268" alt="pics/desugar-02-fork-desugared.png" src="pics/desugar-02-fork-desugared.png">

## De-sugaring _forkjoins_ ("_junctions_")

<img width="330" alt="pics/desugar-03-junction.png" src="pics/desugar-03-junction.png"> => <img width="268" alt="pics/desugar-03-junction-desugared.png" src="pics/desugar-03-junction-desugared.png">

## De-sugaring _choice_

<img width="186" alt="pics/desugar-04-choice.png" src="pics/desugar-04-choice.png"> => <img width="222" alt="pics/desugar-04-choice-desugared.png" src="pics/desugar-04-choice-desugared.png">

## Algorithm

- make a transition between each incoming state to each outgoing state
- in that transition put a label with `[${choicelabel} ${outgoingTransitionLabel}]`
- remove the choice state and all its incoming and outgoing transitions

definitions:

- incoming transition: a transition of which this choice is the 'to' state
- incoming state: the 'from' state of an incoming transition
- outgoing transition: a transition of which this choice is the 'from' state
- outgoing state: the 'to' state of an outgoing transition

## The semantics of _initial_

The _initial_ pseudo state is actually a trick to show what
the _actual_ initial state is.

<img width="482" alt="pics/desugar-05-initial.png" src="pics/desugar-05-initial.png">
