import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import SidebarStudentDashboard from "../../../components/SidebarStudentDashboard";
import { prisma } from "../../../lib/prisma";

const StudentDashboard: NextPage = () => {
  const { data: session }: any = useSession();
  return (
    <>
      <div>
        <SidebarStudentDashboard student_id={session?.user?.student_id}>
          Beranda Akun Siswa {session?.user?.student_id}
        </SidebarStudentDashboard>
      </div>
    </>
  );
};

export default StudentDashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = ctx.params?.id;

  const students = await prisma.student.findUnique({
    where: {
      student_id: id as string,
    },
  });

  if (!students) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}
