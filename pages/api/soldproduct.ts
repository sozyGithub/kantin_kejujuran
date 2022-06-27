import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (req.method === "POST" && session) {
    try {
      await prisma.soldProduct.createMany({
        data: req.body,
      });
      res.status(200).json({ success: "Sukses menambahkan produk terjual." });
    } catch {
      res.status(400).json({ error: "Gagal menambahkan produk terjual." });
    }
  } else {
    res.status(400).json({ message: "Metode ini tidak tersedia." });
  }
}
