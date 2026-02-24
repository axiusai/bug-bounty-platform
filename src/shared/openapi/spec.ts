export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Bug Bounty Platform API",
    description:
      "Trust-driven bug bounty marketplace. Identity verification, credit-based rewards, and platform governance.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  paths: {
    "/identity": {
      get: {
        summary: "Identity API",
        description: "Identity module endpoints - not yet implemented",
        tags: ["Identity"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
    "/organization": {
      get: {
        summary: "Organization API",
        description: "Organization module endpoints - not yet implemented",
        tags: ["Organization"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
    "/program": {
      get: {
        summary: "Program API",
        description: "Program module endpoints - not yet implemented",
        tags: ["Program"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
    "/reporting": {
      get: {
        summary: "Reporting API",
        description: "Reporting module endpoints - not yet implemented",
        tags: ["Reporting"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
    "/finance": {
      get: {
        summary: "Finance API",
        description: "Credit wallet, reservations, payouts - not yet implemented",
        tags: ["Finance"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
    "/governance": {
      get: {
        summary: "Governance API",
        description: "Platform governance policies - not yet implemented",
        tags: ["Governance"],
        responses: {
          "200": { $ref: "#/components/responses/Success" },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiResponse: {
        type: "object",
        required: ["success", "data", "error"],
        properties: {
          success: { type: "boolean", description: "Whether the request succeeded" },
          data: {
            type: "object",
            nullable: true,
            description: "Response payload when success is true",
          },
          error: {
            type: "object",
            nullable: true,
            properties: {
              code: { type: "string", description: "Error code" },
              message: { type: "string", description: "Human-readable message" },
            },
            description: "Error details when success is false",
          },
        },
      },
    },
    responses: {
      Success: {
        description: "Standard success response",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: true,
              data: {},
              error: null,
            },
          },
        },
      },
      Error: {
        description: "Standard error response",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiResponse" },
            example: {
              success: false,
              data: null,
              error: { code: "UNAUTHORIZED", message: "Authentication required" },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Identity", description: "User identity, verification, profiles" },
    { name: "Organization", description: "Organizations running bounty programs" },
    { name: "Program", description: "Bug bounty programs" },
    { name: "Reporting", description: "Vulnerability reports" },
    { name: "Finance", description: "Credits, reservations, payouts" },
    { name: "Governance", description: "Platform policies" },
  ],
};
