const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().trim().required(),
  ticketNumber: Joi.number().integer().positive().required(),
  row: Joi.string().trim().allow("")
});

const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().required()
});

const movieSchema = Joi.object({
  movieName: Joi.string().trim().required(),
  duration: Joi.number().positive().required(),
  isAdult: Joi.boolean().required()
});

const movieUpdateSchema = Joi.object({
  duration: Joi.number().positive().required(),
  isAdult: Joi.boolean().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  movieSchema,
  movieUpdateSchema
};
