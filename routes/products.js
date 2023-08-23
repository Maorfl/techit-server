const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const joi = require("joi");

const router = express.Router();

const productSchema = joi.object({
    name: joi.string().required().min(2),
    price: joi.number().required(),
    category: joi.string().required().min(2),
    description: joi.string().required().min(2),
    image: joi.string().required().min(2),
});

router.post("/", auth, async (req, res) => {
    try {
        if (!req.payload.isAdmin) return res.status(400).send("Access denied. User is not an admin");

        const { error } = productSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        let product = await Product.findOne({ name: req.body.name, price: req.body.price, category: req.body.category });

        if (product) return res.status(400).send("Product already exists!");

        product = new Product(req.body);
        await product.save();

        res.status(201).send(product);

    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("No such product");
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        // 1. check if user is an admin
        if (!req.payload.isAdmin)
            return res.status(400).send("Access denied. User is not an admin");

        // 2. joi validation
        const { error } = productSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        // 3. check if product already exists
        let product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            req.body,
            { new: true }
        );

        if (!product) return res.status(400).send("Product already exists");

        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        if (!req.payload.isAdmin) return res.status(400).send("Access denied. User is not an admin");

        let product = await Product.findByIdAndDelete({ _id: req.params.id });
        if (!product) return res.status(404).send("No such product!");

        res.status(200).send("Product deleted successfully!");
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;