export default {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "scjson abstract syntax tree schema",
  $ref: "#/definitions/StateMachineType",
  definitions: {
    StateKindType: {
      type: "string",
      enum: ["initial", "final", "state", "history", "parallel"],
    },
    TransitionTypeType: {
      type: "string",
      enum: ["internal", "external"],
    },
    HistoryTypeType: {
      type: "string",
      enum: ["shallow", "deep"],
    },
    TransitionType: {
      type: "object",
      required: [],
      additionalProperties: false,
      properties: {
        event: { type: "string" },
        cond: { type: "string" },
        action: { type: "string" },
        target: { type: "string" },
        type: { $ref: "#/definitions/TransitionTypeType" },
      },
    },
    StateType: {
      type: "object",
      required: ["id", "kind"],
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        kind: { $ref: "#/definitions/StateKindType" },
        type: { $ref: "#/definitions/HistoryTypeType" },
        initial: { type: "string" },
        onentries: {
          type: "array",
          items: { type: "string" },
        },
        onexits: {
          type: "array",
          items: { type: "string" },
        },
        transitions: {
          type: "array",
          items: { $ref: "#/definitions/TransitionType" },
        },
        states: {
          type: "array",
          items: { $ref: "#/definitions/StateType" },
        },
      },
    },
    StateMachineType: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "string" },
        states: {
          type: "array",
          items: { $ref: "#/definitions/StateType" },
        },
      },
    },
  },
};
