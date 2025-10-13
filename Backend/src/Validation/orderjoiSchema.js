const Joi = require("joi");

const orderSchema = Joi.object({
  orderItems: Joi.array().required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid("cod", "cash", "card", "razorpay").required(),
  itemsPrice: Joi.number().optional(),
  shippingPrice: Joi.number().optional(),
  totalPrice: Joi.number().optional(),
});


module.exports = orderSchema;
