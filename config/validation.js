const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  ticketNumber: Joi.number().integer().positive().required(),
  row: Joi.string().trim().allow("")
});

const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required()
});

const durationFields = {
  durationHours: Joi.number().integer().min(0).required(),
  durationMinutes: Joi.number().integer().min(0).max(59).required()
};

const movieSchema = Joi.object({
  movieName: Joi.string().trim().required(),
  ...durationFields,
  isAdult: Joi.boolean().required()
}).custom((value, helpers) => {
  if (value.durationHours === 0 && value.durationMinutes === 0) {
    return helpers.error("any.invalid");
  }

  return value;
}, "duration validation");

const movieUpdateSchema = Joi.object({
  ...durationFields,
  isAdult: Joi.boolean().required()
}).custom((value, helpers) => {
  if (value.durationHours === 0 && value.durationMinutes === 0) {
    return helpers.error("any.invalid");
  }

  return value;
}, "duration validation");

module.exports = {
  registerSchema,
  loginSchema,
  movieSchema,
  movieUpdateSchema
};
