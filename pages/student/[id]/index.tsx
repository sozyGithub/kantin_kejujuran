import { Avatar, Button, Divider, Image, Paper } from "@mantine/core";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import SidebarStudentDashboard from "../../../components/SidebarStudentDashboard";
import { prisma } from "../../../lib/prisma";

const StudentDashboard: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const handleFormatPrice = (price: string) => {
    let segmentPrice = price
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)
      ?.join(".");
    return segmentPrice?.split("").reverse().join("");
  };
  return (
    <>
      <div>
        <SidebarStudentDashboard student_id={session?.user?.student_id}>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl font-bold">
              <span className="font-semibold text-gray-500">Akun</span>{" "}
              {session?.user?.name}
            </p>
            <Divider my="sm" />
            <div className="flex flex-row justify-center">
              <Avatar radius="xl" size="xl" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-row space-x-2 items-center">
                <p className="font-semibold text-gray-600 w-20">ID Siswa:</p>
                <Paper className="flex-1 border border-gray-300" p="xs">
                  <p className="font-bold"> {session?.user?.student_id}</p>
                </Paper>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <p className="font-semibold text-gray-600 w-20">Nama:</p>
                <Paper className="flex-1 border border-gray-300" p="xs">
                  <p className="font-bold"> {session?.user?.name}</p>
                </Paper>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <p className="font-semibold text-gray-600 w-20">Saldo:</p>
                <Paper className="flex-1 border border-gray-300" p="xs">
                  <p className="font-bold">
                    {" "}
                    Rp{handleFormatPrice(String(props.student.balance))}
                  </p>
                </Paper>
              </div>
              <div className="flex flex-row justify-center space-x-2">
                <Link href="/">
                  <Button variant="light">Belanja</Button>
                </Link>
                <Button variant="light" color="red" onClick={() => signOut()}>
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </SidebarStudentDashboard>
      </div>
    </>
  );
};

export default StudentDashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = ctx.params?.id;

  const student = await prisma.student.findUnique({
    where: {
      student_id: id as string,
    },
    select: {
      balance: true,
    },
  });

  if (!student) {
    return {
      notFound: true,
    };
  }

  return {
    props: { student },
  };
}
