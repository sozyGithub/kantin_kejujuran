import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (req.method === "POST" && session) {
    const { name, image, description, price, canteen, quantity, student } =
      req.body;
    try {
      await prisma.product.create({
        data: {
          name,
          image,
          description,
          price,
          canteen: {
            connect: { id: canteen },
          },
          quantity,
          student: {
            connect: { student_id: student },
          },
        },
      });
      res.status(200).json({ success: "Produk berhasil ditambahkan." });
    } catch (error) {
      res.status(400).json({ error: "Produk gagal ditambahkan." });
    }
  } else if (req.method === "DELETE" && session) {
    const { id } = req.body;

    try {
      await prisma.product.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json({ success: "Produk berhasil dihapus." });
    } catch (error) {
      res.status(400).json({ error: "Produk gagal dihapus." });
    }
  } else if (req.method === "PUT" && session && req.body.update === "all") {
    const { id, name, image, description, price, quantity } = req.body;
    try {
      await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          name,
          image,
          description,
          price,
          quantity,
        },
      });
      res.status(200).json({ success: "Produk berhasil diperbarui." });
    } catch (error) {
      res.status(400).json({ error: "Produk gagal diperbarui." });
    }
  } else if (
    req.method === "PUT" &&
    session &&
    req.body.update === "quantity"
  ) {
    try {
      await prisma.$transaction(
        req.body.data.map((product: any) =>
          prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              quantity: product.quantity,
            },
          })
        )
      );
      res.status(200).json({ success: "Produk berhasil diperbarui." });
    } catch {
      res.status(400).json({ error: "Produk gagal diperbarui." });
    }
  } else {
    res.status(404).json({ message: "Metode ini tidak tersedia." });
  }
}
