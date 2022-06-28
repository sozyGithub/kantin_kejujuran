import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    const { student_id, name, password } = req.body;

    // insert data to db using prisma :)
    try {
      const student = await prisma.student.create({
        data: {
          createdAt: new Date(),
          student_id,
          password,
          name,
          balance: 0,
          canteenId: process.env.CANTEEN_ID,
        },
      });
      await prisma.cart.create({
        data: {
          studentId: student.id,
        },
      });
      res.status(200).json({ success: "Siswa berhasil ditambahkan." });
    } catch (error) {
      res.status(400).json({ error: "ID siswa telah terdaftar." });
    }
  } else if (req.method === "PUT" && session && req.body.update === "balance") {
    const { balance, student_id } = req.body;
    try {
      await prisma.student.update({
        where: {
          student_id,
        },
        data: {
          balance,
        },
      });
      res.status(200).json({ success: "Saldo siswa berhasil diperbarui." });
    } catch {
      res.status(400).json({ error: "Saldo siswa gagal diperbarui." });
    }
  } else if (
    req.method === "PUT" &&
    session &&
    req.body.update === "balance_income"
  ) {
    const { balance, student_id, income } = req.body;
    try {
      await prisma.student.update({
        where: {
          student_id,
        },
        data: {
          balance,
          income,
        },
      });
      res
        .status(200)
        .json({ success: "Pendapatan sukses dipindahkan ke saldo Anda." });
    } catch {
      res.status(400).json({ error: "Gagal memproses penarikan." });
    }
  } else {
    res.status(404).json({ error: "Motode permintaan tidak valid." });
  }
}
