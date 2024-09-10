import express, { json } from "express";
import { connect, Schema } from "mongoose";
import cors from "cors";
import multer from "multer";
import Product, { find, findByIdAndDelete } from "./models/product";
import productsRouter from "./routes/products";

const app = express();

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// URI de conexión a MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://vitabarmartin:Ty31LxBWtXtgcNlY@crm.x0gys.mongodb.net/?retryWrites=true&w=majority&appName=crm";

// Middleware
app.use(cors());
app.use(json());

// Conexión a la base de datos MongoDB
connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Modelo de Producto
const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

// Ruta para obtener todos los productos (GET /api/products)
app.get("/api/products", (req, res) => {
  find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Ruta para agregar un nuevo producto (POST /api/products)
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

// Ruta para eliminar un producto (DELETE /api/products/:id)
app.delete("/api/products/:id", (req, res) => {
  findByIdAndDelete(req.params.id)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json("Product not found");
      }
      res.json("Product deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Usar el router para las rutas de productos
app.use("/api/products", productsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
