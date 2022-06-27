import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (req.method === "POST" && session) {
    const { quantity, product, cart } = req.body;
    try {
      await prisma.cartItem.create({
        data: {
          quantity,
          product: {
            connect: {
              id: product,
            },
          },
          cart: {
            connect: {
              id: cart,
            },
          },
        },
      });
      res
        .status(200)
        .json({ success: "Sukses menambahkan produk ke keranjang." });
    } catch (error) {
      res.status(400).json({ error: "Gagal menambahkan produk ke keranjang." });
    }
  } else if (
    req.method === "PUT" &&
    session &&
    req.body.update === "quantity"
  ) {
    const { quantity, id } = req.body;

    try {
      await prisma.cartItem.update({
        where: {
          id: id,
        },
        data: {
          quantity: quantity,
        },
      });
      res
        .status(200)
        .json({ success: "Sukses menambahkan produk ke keranjang." });
    } catch (error) {
      res.status(400).json({ error: "Gagal Menambahkan produk ke keranjang." });
    }
  } else if (req.method === "DELETE" && session && req.body.delete === "many") {
    try {
      await prisma.$transaction(
        req.body.data.map((item: any) =>
          prisma.cartItem.delete({
            where: {
              id: item.id,
            },
          })
        )
      );
      res
        .status(200)
        .json({ success: "Sukses menghapus beberapa produk dari keranjang" });
    } catch {
      res
        .status(400)
        .json({ error: "Gagal menghapus beberapa produk dari keranjang." });
    }
  } else if (
    req.method === "PUT" &&
    session &&
    req.body.update === "many_quantity"
  ) {
    try {
      await prisma.$transaction(
        req.body.data.map((item: any) =>
          prisma.cartItem.update({
            where: {
              id: item.id,
            },
            data: {
              quantity: item.quantity,
            },
          })
        )
      );
      res
        .status(200)
        .json({ success: "Sukses mengubah jumlah produk di keranjang." });
    } catch {
      res
        .status(400)
        .json({ error: "Gagal mengubah jumlah produk di keranjang." });
    }
  }
}
