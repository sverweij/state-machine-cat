export default {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "state-machine-cat abstract syntax tree schema",
  $ref: "#/definitions/StateMachineType",
  $id: "org.js.state-machine-cat/v7.4.0",
  definitions: {
    StateType: {
      type: "string",
      enum: [
        "regular",
        "initial",
        "terminate",
        "final",
        "parallel",
        "history",
        "deephistory",
        "choice",
        "forkjoin",
        "fork",
        "join",
        "junction",
      ],
    },
    TransitionType: {
      type: "string",
      enum: ["internal", "external"],
    },
    NoteType: {
      type: "array",
      items: {
        type: "string",
      },
    },
    ActionTypeType: {
      type: "string",
      enum: ["entry", "activity", "exit"],
    },
    ActionType: {
      type: "object",
      required: ["type", "body"],
      additionalProperties: false,
      properties: {
        type: { $ref: "#/definitions/ActionTypeType" },
        body: { type: "string" },
      },
    },
    ClassType: {
      type: "string",
      pattern: "^[a-zA-Z0-9_\\- ]*$",
    },
    StateMachineType: {
      type: "object",
      additionalProperties: false,
      required: ["states"],
      properties: {
        states: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "type"],
            additionalProperties: false,
            properties: {
              name: {
                description:
                  "The name and identifier of the state. Unique within the root state machine.",
                type: "string",
              },
              type: {
                description:
                  "What kind of state (or pseudo state) this state is. E.g. 'regular' for normal states or 'initial', 'final', 'choice' etc for pseudo states. Most UML (pseudo-) states are supported.",
                $ref: "#/definitions/StateType",
              },
              label: {
                description:
                  "The display label of the state. If it's not present, most renderers will use the states' name in stead.",
                type: "string",
              },
              color: {
                description:
                  'Color to use for rendering the state. Accepts all css color names ("blue") and hex notation - with ("#0000FF77") or without ("#0000FF") transparency.',
                type: "string",
              },
              class: {
                description:
                  "Class name to give the state in dot and svg output.",
                $ref: "#/definitions/ClassType",
              },
              active: {
                description:
                  "If true the state is considered to be active and rendered as such.",
                type: "boolean",
              },
              typeExplicitlySet: {
                description:
                  "The default parser derives the `type` from the `name` with inband signaling. The user can override that behavior by explicitly setting the `type`. This attribute is there to express that (and make sure that on next parses & processing it doesn't get accidentily re-derived from the name again).",
                type: "boolean",
              },
              isComposite: {
                description:
                  "convenience, derived attribute - set to true if there's a state machine inside the state; false in all other cases. For internal use - @deprecated",
                type: "boolean",
              },
              actions: {
                type: "array",
                description:
                  "A series of actions and their types. The type describe when the action takes place (on entry, exit, or otherwise ('activity'))",
                items: { $ref: "#/definitions/ActionType" },
              },
              note: {
                description:
                  "Comments related to this state. Some renderers will use the note attribute to render a note (i.e. as a post-it) attached to the state.",
                $ref: "#/definitions/NoteType",
              },
              statemachine: {
                description: "state machine nested within the state.",
                $ref: "#/definitions/StateMachineType",
              },
            },
          },
        },
        transitions: {
          type: "array",
          items: {
            type: "object",
            required: ["from", "to"],
            additionalProperties: false,
            properties: {
              from: {
                description:
                  "The name of the state this transition transitions from",
                type: "string",
              },
              to: {
                description:
                  "The name of the state this transition transitions to",
                type: "string",
              },
              label: {
                description:
                  "A display label to represent this transition. Parsers can parse this label into events conditions and actions.",
                type: "string",
              },
              event: {
                description: "Event triggering the transition",
                type: "string",
              },
              cond: {
                description: "Condition for the transition to occur.",
                type: "string",
              },
              action: {
                description: "Action to execute when the transition occurs.",
                type: "string",
              },
              note: {
                description: "Comments related to this transition",
                $ref: "#/definitions/NoteType",
              },
              color: {
                description:
                  'Color to use for rendering the transition. Accepts all css color names ("blue") and hex notation - with ("#0000FF77") or without ("#0000FF") transparency.',
                type: "string",
              },
              width: {
                description:
                  "The line width to use for rendering the transition",
                type: "number",
                minimum: 0,
                maximum: 30,
              },
              class: {
                description:
                  "Class name to give the state in dot and svg output.",
                $ref: "#/definitions/ClassType",
              },
              type: {
                description:
                  "Whether the transition is external (default) or internal. See https://www.w3.org/TR/scxml/#transition for details.",
                $ref: "#/definitions/TransitionType",
              },
            },
          },
        },
      },
    },
  },
};
