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

    // Format respons sesuai yang diinginkan
    const responseData = orders.map((order) => ({
      id: order.id,
      products: order.products.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.product.stock,
        sold: item.product.sold,
        created_at: item.product.createdAt,
        updated_at: item.product.updatedAt,
      })),
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    }));

    res.json({ message: "Orders List", data: responseData });
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

    // Pastikan order ditemukan
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Format respons sesuai yang diinginkan
    const responseData = {
      id: order.id,
      products: order.products.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.product.stock,
        sold: item.product.sold,
        created_at: item.product.createdAt,
        updated_at: item.product.updatedAt,
      })),
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    };

    res.json({ message: "Order Detail", data: responseData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrders = async (req, res) => {
  const { products } = req.body; // Array of products with { id, quantity }

  // Validasi input
  if (!products || products.length === 0) {
    return res.status(400).json({ message: "Products are required" });
  }

  try {
    const productIds = products.map((item) => item.id);
    const foundProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (foundProducts.length !== productIds.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    // Gunakan transaksi
    const newOrder = await prisma.$transaction(async (prisma) => {
      // Buat order baru
      const order = await prisma.order.create({
        data: {
          products: {
            create: products.map((item) => {
              const product = foundProducts.find((p) => p.id === item.id);
              return {
                product: { connect: { id: product.id } },
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
      });

      // Update stok dan sold untuk setiap produk
      await Promise.all(
        products.map(async (item) => {
          const product = foundProducts.find((p) => p.id === item.id);
          await prisma.product.update({
            where: { id: product.id },
            data: {
              stock: product.stock - item.quantity, // Kurangi stock
              sold: product.sold + item.quantity, // Tambah sold
            },
          });
        })
      );

      return order; // Kembalikan order yang baru dibuat
    });

    // Ambil detail order dengan produk yang terkait
    const orderWithProducts = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        products: {
          include: {
            product: true, // Ambil informasi produk
          },
        },
      },
    });

    // Format respons sesuai yang diinginkan
    const responseData = {
      id: orderWithProducts.id,
      products: orderWithProducts.products.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.product.stock,
        sold: item.product.sold,
        created_at: item.product.createdAt,
        updated_at: item.product.updatedAt,
      })),
      created_at: orderWithProducts.createdAt,
      updated_at: orderWithProducts.updatedAt,
    };

    res.json({ message: "Order created", data: responseData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrders = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil detail order yang akan dihapus, termasuk produk
    const orderToDelete = await prisma.order.findUnique({
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

    // Pastikan order ditemukan
    if (!orderToDelete) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Gunakan transaksi untuk menjaga konsistensi data
    await prisma.$transaction(async (prisma) => {
      // Hapus semua entri produk terkait
      await prisma.orderProduct.deleteMany({
        where: {
          orderId: orderToDelete.id,
        },
      });

      // Hapus order
      await prisma.order.delete({
        where: {
          id: parseInt(id),
        },
      });
    });

    // Format respons sesuai yang diinginkan
    const responseData = {
      id: orderToDelete.id,
      products: orderToDelete.products.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.product.stock + item.quantity, // Stok dikembalikan
        sold: item.product.sold - item.quantity, // Sold dikurangi
        created_at: item.product.createdAt,
        updated_at: item.product.updatedAt,
      })),
      created_at: orderToDelete.createdAt,
      updated_at: orderToDelete.updatedAt,
    };

    res.json({ message: "Order deleted successfully", data: responseData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllOrders, getOrdersById, createOrders, deleteOrders };
