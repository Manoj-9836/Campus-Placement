const { z } = require("zod");

const createNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
  kind: z.enum(["question", "general"]),
  question: z.string().trim().max(300).optional(),
});

function validate(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new Error("Request validation failed");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = result.error.flatten().fieldErrors;
    throw error;
  }
  return result.data;
}

module.exports = { createNoteSchema, validate };
