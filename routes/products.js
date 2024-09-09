const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Asegúrate de que la ruta sea correcta

// Ruta para obtener todos los productos (GET /api/products)
router.get("/", (req, res) => {
  Product.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Ruta para agregar un nuevo producto (POST /api/products)
router.post("/", (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    originalPrice: req.body.originalPrice,
    currentPrice: req.body.currentPrice,
    discount: req.body.discount,
    category: req.body.category,
    images: req.body.images,
    freeShipping: req.body.freeShipping,
  });

  newProduct
    .save()
    .then(() => res.json("Product added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Ruta para obtener un producto por ID (GET /api/products/:id)
router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.status(404).json("Product not found");
      }
      res.json(product);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Ruta para actualizar un producto por ID (PUT /api/products/:id)
router.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json("Product not found");
      }
      res.json(updatedProduct);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Ruta para eliminar un producto por ID (DELETE /api/products/:id)
router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json("Product not found");
      }
      res.json("Product deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
