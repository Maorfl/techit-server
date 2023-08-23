const express = require("express");
const auth = require("../middleware/auth");
const joi = require("joi");
const Cart = require("../models/Cart");

const router = express.Router();

const productSchema = joi.object({
    _id: joi.string(),
    name: joi.string().required().min(2),
    price: joi.number().required(),
    category: joi.string().required().min(2),
    description: joi.string().required().min(2),
    image: joi.string().required().min(2),
    __v: joi.number(),
    quantity: joi.number().required()
});

router.post("/", auth, async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) return res.status(400).send("Validation");

        let cart = await Cart.findOne({ userId: req.payload._id, active: true });

        if (!cart) return res.status(404).send("No active cart available for this user");

        cart.products.push(req.body);
        await cart.save();

        res.status(201).send("Product added successfully to cart");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.payload._id, active: true });

        if (!cart)
            return res.status(404).send("No active cart available for this user");

        res.status(200).send(cart.products);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;