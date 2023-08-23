const express = require("express");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const products = require("./routes/products");
const carts = require("./routes/carts");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then((res) => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/products", products);
app.use("/api/carts", carts);

app.listen(port, () => console.log("Server started on port", port));