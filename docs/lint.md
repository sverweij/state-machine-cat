
impl? |rule                       |ref      |description
---   |---                        |---      |---
|     |`init-highlander`          |         | There can be at most one _initial_ state per _statemachine_
|     |`init-one-transition`      | 3.6.2   | There is exactly one _transition_ from an _initial_ state   |
|     |`init-transition-no-cond`  | 3.6.2   | A transition from an _initial_ state can have no _condition_
|     |`init-transition-no-event` | 3.6.2   | A transition from an _initial_ state can have no _event_
|     |`init-to-current-state`    | 3.6.2   | A transition from an _initial_ state must be to a _state_ of the _statemachine_ it is part of
|     |`state-transition-attrs`   | 3.6.2   | A transition from an _initial_ state must be to a _state_ of the _statemachine_ it is part of