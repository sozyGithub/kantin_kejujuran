import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Grid,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetStaticPropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Check, Pencil, Trash, X } from "tabler-icons-react";
import SidebarStudentDashboard from "../../../../components/SidebarStudentDashboard";
import { prisma } from "../../../../lib/prisma";

const StudentProduct: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    saving: false,
  });
  const handleFormatPrice = (price: string) => {
    let segmentPrice = price
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)
      ?.join(",");
    return segmentPrice?.split("").reverse().join("");
  };
  const handleDeleteProduct = async (id: string) => {
    setValue({ ...value, saving: true });
    const data = { id: id };
    try {
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((r) => r.json());
      if (res.error) {
        showNotification({
          title: "Gagal!",
          message: res.error,
          color: "red",
          icon: <X />,
        });
      } else {
        showNotification({
          title: "Sukses!",
          message: res.success,
          color: "green",
          icon: <Check />,
        });
        router.push(`/student/${session?.user?.student_id}/product`);
      }
    } catch (error) {
      showNotification({
        title: "Gagal!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, saving: false });
  };
  return (
    <>
      <SidebarStudentDashboard student_id={session?.user?.student_id}>
        <div className="max-w-4xl mx-auto">
          {value.saving && <LoadingOverlay visible={true} />}
          <Grid>
            {props.products.map((product: any) => (
              <Grid.Col md={4} lg={3}>
                <Card shadow="sm">
                  <Card.Section>
                    <Image src={product.image} withPlaceholder height={180} />
                  </Card.Section>
                  <div className="overflow-hidden h-24 py-2">
                    <p className="text-gray-600 font-semibold text-lg">
                      {product.name}
                    </p>
                    <p className="text-sm text-clip">{product.description}</p>
                  </div>
                  <Divider my="sm" />
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-base font-semibold">
                      Rp{handleFormatPrice(String(product.price))}
                    </p>
                    {product.quantity ? (
                      <p className="text-xs font-semibold">
                        <span className="text-gray-600">Tersisa:</span>{" "}
                        {product.quantity}
                      </p>
                    ) : (
                      <Badge color="red">Habis</Badge>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <ActionIcon
                      variant="light"
                      radius="lg"
                      color="red"
                      onClick={() => {
                        handleDeleteProduct(product.id);
                        console.log(product.id);
                      }}
                    >
                      <Trash size={15} />
                    </ActionIcon>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Link
                      href={`/student/${session?.user?.student_id}/product/${product.id}/update`}
                    >
                      <ActionIcon variant="light" radius="lg" color="blue">
                        <Pencil size={15} />
                      </ActionIcon>
                    </Link>
                  </div>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </SidebarStudentDashboard>
    </>
  );
};

export default StudentProduct;

export async function getStaticPaths() {
  const students = await prisma.student.findMany({
    select: {
      student_id: true,
    },
  });

  const paths = students.map((student) => ({
    params: { id: student.student_id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      description: true,
      image: true,
      quantity: true,
      price: true,
      id: true,
    },
    where: {
      studentId: params?.student_id as string,
    },
  });

  return {
    props: { products },
    revalidate: 1,
  };
}
