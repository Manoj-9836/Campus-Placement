const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  institution: z.string().trim().min(2).max(200),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

const refreshSchema = z.object({ refreshToken: z.string().min(1) });

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

module.exports = { registerSchema, loginSchema, refreshSchema, validate };
