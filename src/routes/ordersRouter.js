const router = require("express").Router();
const {
  getAllOrders,
  getOrdersById,
  createOrders,
  deleteOrders,
} = require("../controllers/ordersControllers.js");

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrdersById);
router.post("/orders", createOrders);
router.delete("/orders/:id", deleteOrders);

module.exports = router;
