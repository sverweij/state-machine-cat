# State Machine Cat and XMI (deprecated)

> :rotating_light: XMI support in state machine cat is **deprecated**. It will be removed
> in the next major release - which will probably coincide with the introduction of node 14.
>
> #### Why deprecate XMI support?
>
> XMI is a gnarly format which takes a lot of effort to do well. I don't use it, and the
> use in other contexts eludes me. On top each suppliers implements a different flavor,
> so xmi created with one tool will look like something hit by a truck in another (if
> it works at all).
>
> (If you read this, do see a use for xmi support in state-machine-cat _and_ are willing to
> take up maintenance - please get in touch).
>
> In the mean time I encourage you to look into [SCXML](./SCXML.md) - which
> is a well defined standard state-machine-cat supports quite well.

XML Metadata Interchange is a [OMG standard](https://www.omg.org/spec/XMI) that
aims to be a format that enables tools to exchange models with each other. It's
meant to be read by machines - as opposed to e.g. [SCXML](./SCXML.md) - or
state-machine-cat's language.

It looks like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.0" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">
    <xmi:Documentation exporter="state-machine-cat" exporterVersion="4.6.0-beta-1"/>
    <uml:Model xmi:id="rootmodel" xmi:type="uml:Model" name="RootModel">
        <packagedElement xmi:id="model" name="Model" visibility="public" xmi:type="uml:Model">
            <packagedElement xmi:id="statemachine" name="AStateMachine" visibility="public" isReentrant="true" xmi:type="uml:StateMachine">
                <region xmi:id="region" visibility="public" xmi:type="uml:Region">
                    <subvertex xmi:id="eat" name="eat" visibility="public" xmi:type="uml:State"/>
                    <subvertex xmi:id="sleep" name="sleep" visibility="public" xmi:type="uml:State"/>
                    <subvertex xmi:id="meow" name="meow" visibility="public" xmi:type="uml:State"/>
                    <subvertex xmi:id="play" name="play" visibility="public" xmi:type="uml:State"/>
                    </subvertex>
                    <transition xmi:id="sleep_to_meow" visibility="public" xmi:type="uml:Transition" source="sleep" target="meow" kind="external">
                        <ownedMember xmi:id="sleep_to_meow_event_wake_up" name="wake_up" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="sleep_to_meow_event" xmi:type="uml:Trigger" name="wake_up" event="sleep_to_meow_event_wake_up"/>
                        <trigger xmi:id="sleep_to_meow_event_wake_up" name="wake_up" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                    <transition xmi:id="meow_to_meow" visibility="public" xmi:type="uml:Transition" source="meow" target="meow" kind="external">
                        <ownedMember xmi:id="meow_to_meow_event_no_response_from_human" name="no_response_from_human" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="meow_to_meow_event" xmi:type="uml:Trigger" name="no_response_from_human" event="meow_to_meow_event_no_response_from_human"/>
                        <trigger xmi:id="meow_to_meow_event_no_response_from_human" name="no_response_from_human" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                    <transition xmi:id="meow_to_eat" visibility="public" xmi:type="uml:Transition" source="meow" target="eat" kind="external">
                        <ownedMember xmi:id="meow_to_eat_event_human_gives_food" name="human_gives_food" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="meow_to_eat_event" xmi:type="uml:Trigger" name="human_gives_food" event="meow_to_eat_event_human_gives_food"/>
                        <trigger xmi:id="meow_to_eat_event_human_gives_food" name="human_gives_food" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                    <transition xmi:id="meow_to_play" visibility="public" xmi:type="uml:Transition" source="meow" target="play" kind="external">
                        <ownedMember xmi:id="meow_to_play_event_human_gives_toy" name="human_gives_toy" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="meow_to_play_event" xmi:type="uml:Trigger" name="human_gives_toy" event="meow_to_play_event_human_gives_toy"/>
                        <trigger xmi:id="meow_to_play_event_human_gives_toy" name="human_gives_toy" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                    <transition xmi:id="play_to_sleep" visibility="public" xmi:type="uml:Transition" source="play" target="sleep" kind="external">
                        <ownedMember xmi:id="play_to_sleep_event_tired_or_bored" name="tired_or_bored" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="play_to_sleep_event" xmi:type="uml:Trigger" name="tired_or_bored" event="play_to_sleep_event_tired_or_bored"/>
                        <trigger xmi:id="play_to_sleep_event_tired_or_bored" name="tired_or_bored" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                    <transition xmi:id="eat_to_sleep" visibility="public" xmi:type="uml:Transition" source="eat" target="sleep" kind="external">
                        <ownedMember xmi:id="eat_to_sleep_event_belly_full" name="belly_full" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                        <trigger xmi:id="eat_to_sleep_event" xmi:type="uml:Trigger" name="belly_full" event="eat_to_sleep_event_belly_full"/>
                        <trigger xmi:id="eat_to_sleep_event_belly_full" name="belly_full" visibility="public" xmi:type="uml:AnyReceiveEvent"/>
                    </transition>
                </region>
            </packagedElement>
        </packagedElement>
    </uml:Model>
</xmi:XMI>
```

(State Machine Cat uses readable id's instead of uuid's or hashes )

## Usage

Both the command line and the online interpreter support xmi output.

- Command line: `smcat --output-type xmi mycoolchart.smcat`
- Online interpreter: pick XMI\_ from the hamburger menu.

## What is supported?

For state machines XMI is an notation for UML, just like _smcat_ is
so out of the box everything is supported - including nested, parallel
and pseudo states - _except_ `termination` `entry point`
and `exit point` pseudo states

> For those pointing out that state-machine-cat doesn't support
> the `junction` pseudotype: a `junction` is just a fork/join
> pseudo element with multiple ins & multple outs...

## What more do I need to know?

- XMI is not for human consumption - so _state machine cat_ tranfsorms
  id's, names and events into valid XML names in the same way it
  transforms SCXML. It tries to keep things readable, though.
- XMI tools typically get in a tizzy when there's duplicate xmi:id's, so
  _state machine cat_ takes care to keep everything unique with an
  as readable context as possible (e.g. `entry/ hoi pippeloi` on state
  `entering` will be called `entering_entry_hoi_pippeloi`).

#### References

- [OMG XMI standard](https://www.omg.org/spec/XMI)
- [Version 2.1 of the OMG XMI standard](https://www.omg.org/spec/XMI/2.1) - which is the one _state machine cat_ emits at the moment

## Why?

- Because [somebody asked for it](https://github.com/sverweij/state-machine-cat/issues/44)
- Because it's always interesting to peek in - in this case that of the XMI designers.
- To provide a simple too to generate (state machine) xmi - that despite its age is still
  in use in code generation land.
