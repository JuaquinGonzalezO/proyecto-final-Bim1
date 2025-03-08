import PDFDocument from "pdfkit";
import Invoice from "../factura/factura-model.js"
import Cart from "../shopping cart/shopping cart-model.js";
import Producto from "../productos/productos-model.js";
import fs from "fs";
import path from "path";

export const confirmPurchase = async (req, res) => {
  try {
      const { usuario } = req;
      let { nit, address } = req.body;

      if (!nit || (typeof nit === "string" && nit.trim() === "")) {
        nit = "CF";
    } else {
        nit = String(nit).trim();
    }

      const cart = await Cart.findOne({ owner: usuario._id })
          .populate("products.idProduct", "name price stock");

      if (!cart || cart.products.length === 0) {
          return res.status(400).json({
              success: false,
              message: "Cart is empty or not found"
          });
      }

      let total = 0;
      cart.products.forEach(prod => {
          total += prod.subTotal;
      });

      const bill = new Invoice({
          user: usuario._id,
          NIT: nit,
          date: new Date(),
          products: cart.products.map(item => ({
              idProduct: item.idProduct._id,
              name: item.idProduct.name,
              price: item.idProduct.price,
              quantity: item.quantity,
              subTotal: item.subTotal
          })),
          total: total
      });

      await bill.save();

      // Actualiza el stock de los productos
      for (const item of cart.products) {
          await Producto.findByIdAndUpdate(item.idProduct._id, {
              $inc: {
                  stock: -item.quantity,
                  sold: item.quantity
              }
          });
      }

      const billNum = bill._id.toString();
      const fileName = `bill-${billNum}.pdf`;
      const dir = path.join(path.resolve(), 'public', 'uploads', 'bills');
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, fileName);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Encabezado de la factura
      doc.fontSize(18).text("Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12)
      .text(`Invoice #: ${billNum}`)
      .text(`Date: ${new Date(bill.date).toLocaleDateString()}`)
      .text(`Customer: ${usuario.name}`)
      .text(`NIT ${nit}`)
      .text(`Email: ${usuario.email}`)
      .text(`Address: ${address}`);
      doc.moveDown();

      // Tabla de productos
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 200;
      const col3 = 300;
      const col4 = 370;
      const col5 = 450;

      // Títulos de las columnas con negrita
      doc.font("Helvetica-Bold");
      doc.text("#", col1, tableTop);
      doc.text("Product", col2, tableTop);
      doc.text("Quantity", col3, tableTop);
      doc.text("Price", col4, tableTop);
      doc.text("Subtotal", col5, tableTop);
      doc.moveDown(); // Mueve la posición Y después de los encabezados

      // Datos de los productos
      doc.font("Helvetica"); // Vuelve a fuente normal
      bill.products.forEach((item, i) => {
          const y = tableTop + 20 + (i * 20); // Espaciado correcto
          doc.text(`${i + 1}`, col1, y);
          doc.text(item.name, col2, y);
          doc.text(item.quantity.toString(), col3, y);
          doc.text(`Q${item.price.toFixed(2)}`, col4, y);
          doc.text(`Q${item.subTotal.toFixed(2)}`, col5, y);
      });

      doc.moveDown(); // Añadir espacio antes del total
      doc.fontSize(14).text(`Total: Q${total.toFixed(2)}`, { align: 'right' });

      // Finaliza la escritura del PDF
      doc.end();

      // Limpia el carrito
      cart.products = [];
      await cart.save();

      // Responde con la factura generada
      res.status(200).json({
          success: true,
          message: "Purchase completed successfully",
          bill: bill
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error completing purchase",
          error: err.message
      });
  }
};

export const getPurchases = async (req, res) => {
  try {
      const { usuario } = req;
      const bills = await Invoice.find({ user: usuario._id });

      if (!bills || bills.length === 0) {
          return res.status(400).json({ 
              success: false, 
              message: "No purchases found" 
          });
      }
      res.status(200).json({
          success: true,
          bills: bills
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Error getting purchases",
          error: err.message
      });
  }
}