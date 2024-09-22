const router = require("express").Router();
const {
  getAllProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProducts,
} = require("../controllers/productsControllers.js");

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsById);
router.post("/products", createProducts);
router.put("/products/:id", updateProducts);
router.delete("/products/:id", deleteProducts);

module.exports = router;
