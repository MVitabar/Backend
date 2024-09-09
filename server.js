const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const Product = require("./models/product");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos MongoDB
mongoose
  .connect("mongodb://localhost:27017/crm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Modelo de Producto
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

// Ruta para obtener todos los productos (GET /api/products)
app.get("/api/products", (req, res) => {
  Product.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});
app.post("/api/products", (req, res) => {
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

app.delete("/api/products/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json("Product not found");
      }
      res.json("Product deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.use("/api/products", productsRouter);
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
