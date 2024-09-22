const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ message: "Product List", data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductsById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: "Product Detail", data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProducts = async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        stock,
      },
    });
    res.json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProducts = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        price,
        stock,
      },
    });
    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: "Product deleted successfully", data: deleteProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProducts,
};
