import { Button, Divider, Image, LoadingOverlay, Paper } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Minus,
  Plus,
  ReportMedical,
  ReportMoney,
  ShoppingCart,
  Trash,
  X,
} from "tabler-icons-react";
import Navbar from "../../../components/Navbar";
import { prisma } from "../../../lib/prisma";

const StudentCart: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    cart: props.cartPerItemQuantity,
    totalProduct: props.cartItemQuantity,
    loading: false,
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
  const handleRemoveAllCart = async () => {
    setValue({ ...value, loading: true });
    const data: any = {
      update: "many_quantity",
      data: [],
    };
    props.cartItem
      .filter((item: any) => item.quantity > 0)
      .map((item: any) => {
        data.data.push({
          id: item.id,
          quantity: 0,
        });
      });
    try {
      await fetch("/api/cartitem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      router.push("/");
    } catch {
      showNotification({
        title: "Kesalahan!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, loading: false });
  };
  const handleAddCart = async (productID: string, cartItemID: string) => {
    setValue({ ...value, loading: true });
    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[productID] + 1,
        update: "quantity",
      };
      await fetch("/api/cartitem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUpdate),
      });
      let _ = value;
      _.cart[productID]++;
      _.totalProduct++;
      setValue({ ..._ });
    } catch (error) {
      showNotification({
        title: "Kesalahan!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, loading: false });
  };
  const handleRemoveCart = async (productID: string, cartItemID: string) => {
    setValue({ ...value, loading: true });
    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[productID] - 1,
        update: "quantity",
      };
      await fetch("/api/cartitem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUpdate),
      });
      let _ = value;
      _.cart[productID]--;
      _.totalProduct--;
      setValue({ ..._ });
      if (_.cart[productID] === 0)
        router.push(`/student/${session?.user?.student_id}/cart`);
    } catch (error) {
      showNotification({
        title: "Kesalahan!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, loading: false });
  };
  return (
    <>
      <Navbar quantity={value.totalProduct} />
      <div className="max-w-6xl mx-auto w-full p-2 space-y-2">
        <LoadingOverlay visible={value.loading} />
        <h2 className="text-xl font-bold text-gray-700 py-4">Keranjang Saya</h2>
        {props.cartItem
          .filter((item: any) => item.quantity > 0 && item.product.quantity > 0)
          .map((item: any) => (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    className=" object-cover max-h-40 w-28"
                    src={item.product.image}
                    alt="Man looking at item at a store"
                  />
                </div>
                <div className="p-4 max-h-40 overflow-auto">
                  <div className="uppercase tracking-wide text-indigo-500 font-semibold">
                    {item.product.name}
                  </div>
                  <p className="mt-1 text-sm leading-tight text-black font-semibold">
                    Rp{handleFormatPrice(String(item.product.price))} x{" "}
                    {value.cart[item.product.id]}
                  </p>
                  <p className="mt-1">
                    Tersisa:{" "}
                    <span className="font-semibold leading-tight">
                      {item.product.quantity}
                    </span>
                  </p>
                  <div className="mt-1 space-x-2">
                    {value.cart[item.product.id] > 0 && (
                      <Button
                        variant="light"
                        color="red"
                        leftIcon={<Minus size={15} />}
                        onClick={() => {
                          handleRemoveCart(item.product.id, item.id);
                        }}
                      >
                        <ShoppingCart size={15} />
                      </Button>
                    )}
                    {value.cart[item.product.id] < item.product.quantity && (
                      <Button
                        variant="light"
                        color="indigo"
                        leftIcon={<Plus size={15} />}
                        onClick={() => {
                          handleAddCart(item.product.id, item.id);
                        }}
                      >
                        <ShoppingCart size={15} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {props.cartItem.filter((item: any) => item.quantity > 0).length > 0 ? (
          <div className="flex justify-between">
            <Button
              variant="light"
              color="red"
              leftIcon={<Trash size={15} />}
              onClick={handleRemoveAllCart}
            >
              Kosongkan
            </Button>
            <Link href={`/student/${session?.user?.student_id}/checkout`}>
              <Button variant="light" leftIcon={<ReportMoney size={15} />}>
                Pembayaran
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-row justify-center">
            <p className=" text-gray-600 font-semibold bg-gray-100 p-2 rounded-md border border-gray-300">
              Tidak ada produk.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentCart;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { id } = ctx.query;

  const cart = await prisma.cart.findMany({
    where: {
      student: {
        student_id: id as string,
      },
    },
    select: {
      cart_item: {
        select: {
          id: true,
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              quantity: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  let cartItemQuantity: number = 0;
  let cartPerItemQuantity: any = {};
  cart[0].cart_item.map((item: any) => {
    cartPerItemQuantity[item.product.id] = item.quantity;
    cartItemQuantity += item.quantity as number;
  });

  return {
    props: {
      cartItem: cart[0].cart_item,
      cartItemQuantity: cartItemQuantity,
      cartPerItemQuantity: cartPerItemQuantity,
    },
  };
}
