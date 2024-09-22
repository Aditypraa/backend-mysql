const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({ message: "Order List", data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrdersById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({ message: "Order Detail", data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrders = async (req, res) => {
  const { products } = req.body; // Array of products with { productId, quantity, price }
  try {
    const newOrder = await prisma.order.create({
      data: {
        products: {
          create: products.map((item) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    res.json({ message: "Order created", data: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: "Order deleted", data: deletedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllOrders, getOrdersById, createOrders, deleteOrders };
