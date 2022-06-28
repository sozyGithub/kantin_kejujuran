import { Button, Divider, LoadingOverlay, NumberInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowRight, Check, FishHook, X } from "tabler-icons-react";
import ModalConfirmHook from "../../../../components/ModalConfirmHook";
import SidebarStudentDashboard from "../../../../components/SidebarStudentDashboard";
import { prisma } from "../../../../lib/prisma";

const StudentSoldProduct: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    hook: 0,
    processing: false,
  });
  const handleFormatPrice = (price: string) => {
    let segmentPrice = price
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)
      ?.join(".");
    return segmentPrice?.split("").reverse().join("");
  };
  const handleHookIncome = async () => {
    const data = {
      student_id: session?.user?.student_id,
      balance: props.balance + value.hook,
      income: props.income - value.hook,
      update: "balance_income",
    };
    setValue({ ...value, processing: true });
    if (value.hook <= props.income) {
      try {
        const res = await fetch("/api/student", {
          method: "PUT",
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
            autoClose: 10000,
          });
        } else {
          router.push(`/student/${session?.user?.student_id}/product/sold`);
          showNotification({
            title: "Sukses!",
            message: res.success,
            color: "green",
            icon: <Check />,
          });
        }
      } catch {
        showNotification({
          title: "Penarikan Saldo Gagal!",
          message: "Silahkan coba beberapa saat lagi.",
          color: "red",
          icon: <X />,
          autoClose: 10000,
        });
      }
    } else {
      showNotification({
        title: "Penarikan Saldo Gagal",
        message:
          "Saldo yang Anda tarik melebihi pendapatan Anda. Penarikan tidak dapat diproses. Saldo Anda saat ini dikurangi Rp100",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, processing: false, hook: 0 });
  };
  return (
    <>
      <SidebarStudentDashboard>
        <LoadingOverlay visible={value.processing} />
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-semibold text-gray-600 text-xl">Terjual</p>
          <Divider />
          {props.income > 0 && (
            <div className="bg-white p-2 border border-gray-300 shadow rounded-md space-y-2">
              <p>
                Pendapatan{" "}
                <span className="font-semibold">
                  Rp{handleFormatPrice(String(props.income))}
                </span>{" "}
                tersimpan di saldo kantin.
              </p>
              <Divider label="Masukkan ke saldo Anda: " my="sm" />
              <div className="flex flex-row space-x-2 items-center">
                <p>Rp</p>
                <NumberInput
                  className="flex-1"
                  min={0}
                  value={value.hook}
                  onChange={(e) => {
                    setValue({ ...value, hook: e as number });
                  }}
                  placeholder={props.income}
                />
              </div>
              <div className="flex flex-row justify-end">
                <ModalConfirmHook
                  input={handleFormatPrice(String(value.hook))}
                  income={handleFormatPrice(String(props.income))}
                  handleHookIncome={() => handleHookIncome()}
                />
              </div>
            </div>
          )}
          {props.soldProducts.map((product: any, i: number) => (
            <div key={i} className="space-y-2">
              <div className="flex flex-row space-x-2 items-center">
                <div className="bg-white p-2 rounded-xl max-w-max shadow border border-gray-300">
                  <p className="text-xs text-gray-500">{product.soldTime}</p>
                </div>
                <Divider className="flex-1" size="sm" variant="dashed" />
              </div>
              <div className="bg-white p-2 border border-l-gray-300 shadow rounded-md flex flex-row space-x-2 items-center">
                <img
                  src={product.product.image}
                  className="w-20 rounded-md shadow"
                />
                <div>
                  <p className="uppercase font-semibold text-indigo-500">
                    {product.product.name}
                  </p>
                  <p className="text-sm">
                    Terjual:{" "}
                    <span className="font-semibold">{product.quantity}</span>
                  </p>
                  <p className="text-sm">
                    Pendapatan:{" "}
                    <span className="font-semibold">
                      Rp
                      {handleFormatPrice(
                        String(product.quantity * product.product.price)
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          {props.soldProducts.length === 0 && (
            <div className="flex flex-row justify-center">
              <div className="bg-white p-2 rounded-md shadow border border-gray-300 max-w-max">
                <p className="font-bold text-sm text-gray-600 text-center">
                  Tidak ada produk yang terjual.
                </p>
              </div>
            </div>
          )}
        </div>
      </SidebarStudentDashboard>
    </>
  );
};

export default StudentSoldProduct;

export async function getServerSideProps({
  params,
  req,
}: GetServerSidePropsContext) {
  const session: any = await getSession({ req });
  if (session?.user?.student_id != params?.id)
    return {
      notFound: true,
    };

  // fetch all sold product for current student
  const soldProducts = await prisma.soldProduct.findMany({
    orderBy: {
      soldTime: "desc",
    },
    where: {
      product: {
        student: {
          student_id: params?.id as string,
        },
      },
    },
    select: {
      soldTime: true,
      product: true,
      quantity: true,
    },
  });

  // fetch the amount of money student get after selling their products
  const incomeAndBalance = await prisma.student.findUnique({
    where: {
      student_id: session?.user?.student_id,
    },
    select: {
      income: true,
      balance: true,
    },
  });

  // change the DateTime to string
  soldProducts.map((product: any) => {
    product.soldTime = product.soldTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    product.product.createdAt = product.product.createdAt.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  });

  return {
    props: {
      soldProducts,
      income: incomeAndBalance?.income,
      balance: incomeAndBalance?.balance,
    },
  };
}
