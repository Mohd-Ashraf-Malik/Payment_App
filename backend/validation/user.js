const zod = require('zod');
const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

const loginSchema = zod.object({
    username: zod.string(),
    password: zod.string()
});

const userUpdateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});
module.exports = {
    signupSchema,
    loginSchema,
    userUpdateSchema,
}