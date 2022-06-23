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
      await prisma.student.create({
        data: {
          createdAt: new Date(),
          student_id,
          password,
          name,
          balance: 0,
        },
      });
      res.status(200).json({ success: "Siswa berhasil ditambahkan." });
    } catch (error) {
      res.status(400).json({ error: "ID siswa telah terdaftar." });
    }
  } else {
    res.status(404).json({ error: "Motode permintaan tidak valid." });
  }
}
