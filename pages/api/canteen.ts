import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (req.method === "PUT" && session) {
    try {
      const { balance, id } = req.body;
      await prisma.canteen.update({
        where: {
          id,
        },
        data: {
          balance,
        },
      });
      res.status(200).json({ success: "Saldo kantin sukses diperbarui." });
    } catch {
      res.status(400).json({ error: "Saldo kantin gagal diperbarui." });
    }
  } else {
    res.status(404).json({ message: "Metode ini tidak valid." });
  }
}
