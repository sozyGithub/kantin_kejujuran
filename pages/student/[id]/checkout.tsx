import {
  Alert,
  Button,
  Divider,
  Image,
  LoadingOverlay,
  NumberInput,
  Paper,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { AlertCircle, Minus, Plus, ShoppingCart, X } from "tabler-icons-react";
import ModalConfirmPayment from "../../../components/ModalConfirmPayment";
import Navbar from "../../../components/Navbar";
import { prisma } from "../../../lib/prisma";

const StudentCart: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    cart: props.cartPerItemQuantity,
    totalProduct: props.cartItemQuantity,
    inputTotalPrice: -1,
    loadingConfirm: false,
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
  const handleConfirmPayment = async () => {
    setValue({ ...value, loadingConfirm: true });
    if (value.inputTotalPrice === +props.totalShopping.split(".").join("")) {
      let dataBought: any = [];
      let dataSold: any = [];
      let dataProduct: any = {
        update: "quantity",
        data: [],
      };
      let dataCartItem: any = {
        update: "many_quantity",
        data: [],
      };
      let dataCartItemRemove: any = {
        delete: "many",
        data: [],
      };
      let dataCartItemObject: any = {};
      // construct data for allCartItem
      props.allCartItem.map((item: any) => {
        dataCartItemObject[item.id] = item.quantity;
      });
      props.cartItem
        .filter((item: any) => item.quantity > 0)
        .map((item: any) => {
          dataBought.push({
            studentId: props.studentId,
            productId: item.product.id,
            buyTime: new Date(),
            quantity: item.quantity,
          });
          dataSold.push({
            productId: item.product.id,
            soldTime: new Date(),
            quantity: item.quantity,
          });
          dataProduct.data.push({
            id: item.product.id,
            quantity: item.product.quantity - item.quantity,
          });
          dataCartItem.data.push({
            id: item.id,
            quantity: Math.min(
              item.product.quantity - item.quantity,
              dataCartItemObject[item.id]
            ),
          });
          dataCartItemRemove.data.push({
            id: item.id,
          });
        });

      const dataCanteen = {
        id: props.canteenId,
        balance: props.canteenBalance + value.inputTotalPrice,
      };
      const dataStudent = {
        student_id: session?.user?.student_id,
        balance: props.studentBalance - value.inputTotalPrice,
        update: "balance",
      };
      try {
        // add bought item to the bought table on db
        await fetch("/api/boughtproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataBought),
        });
        // add bought item to the sold table on db
        await fetch("/api/soldproduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSold),
        });
        // change canteen balance
        await fetch("/api/canteen", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataCanteen),
        });
        // change student balance
        await fetch("/api/student", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataStudent),
        });
        // change every product quantity on the cart
        await fetch("/api/product", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataProduct),
        });
        // change every product quantity on the cartitem for every student
        await fetch("/api/cartitem", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataCartItem),
        });
        // remove every item from the cart
        await fetch("/api/cartitem", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataCartItemRemove),
        });
      } catch {}
      setValue({ ...value, loadingConfirm: false });
    } else if (
      value.inputTotalPrice < +props.totalShopping.split(".").join("")
    ) {
      try {
        const data = {
          balance:
            props.studentBalance - 100 >= 0 ? props.studentBalance - 100 : 0,
          update: "balance",
          student_id: session?.user?.student_id,
        };
        const res = await fetch("/api/student", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        showNotification({
          title: "Transaksi Gagal!",
          message:
            "Total uang yang Anda input kurang dari total belanja Anda. Saldo Anda dikurangi sebesar Rp100.",
          icon: <X />,
          color: "red",
        });
        setValue({ ...value, loadingConfirm: false });
      } catch {}
    }
  };
  const handleAddCart = async (productID: string, cartItemID: string) => {
    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[productID] + 1,
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
  };
  const handleRemoveCart = async (productID: string, cartItemID: string) => {
    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[productID] - 1,
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
  };
  return (
    <>
      <Navbar quantity={value.totalProduct} />
      <div className="max-w-6xl mx-auto w-full p-2 space-y-2">
        <LoadingOverlay visible={value.loadingConfirm} />
        <h2 className="text-xl font-bold text-gray-700 py-4">Pembayaran</h2>
        {props.cartItem
          .filter((item: any) => item.quantity > 0 && item.product.quantity > 0)
          .map((item: any) => (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    className="object-cover w-28 max-h-28"
                    src={item.product.image}
                    alt="Man looking at item at a store"
                  />
                </div>
                <div className="p-4 max-h-28 overflow-auto">
                  <div className="uppercase tracking-wide text-sm md:text-base text-indigo-500 font-semibold">
                    {item.product.name}
                  </div>
                  <p className="mt-1 text-xs md:text-sm leading-tight text-black font-semibold">
                    Rp{handleFormatPrice(String(item.product.price))} x{" "}
                    {value.cart[item.product.id]}
                  </p>
                  <p className="mt-1 text-xs md:text-sm font-bold text-emerald-500 tracking-wide">
                    {" "}
                    = Rp
                    {handleFormatPrice(
                      String(item.product.price * value.cart[item.product.id])
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        <Divider label="INVOICE" my="sm" />
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5 space-y-2">
            <p className="tracking-wide">
              Total Belanja:{" "}
              <span className="font-bold tracking-wide">
                Rp{props.totalShopping}
              </span>
            </p>
            <Alert
              icon={<AlertCircle size={15} />}
              title="Perlu Diperhatikan!"
              color="yellow"
            >
              <i>Ketidakjujuran akan merugikan Anda.</i>
            </Alert>
            <p className="text-sm my-1">
              Ketikkan jumlah uang sesuai total belanja:
            </p>
            <div className="flex space-x-2 items-center">
              <p>Rp</p>
              <NumberInput
                className="flex-1"
                min={0}
                placeholder={`${props.totalShopping.split(".").join("")}`}
                max={props.studentBalance}
                disabled={
                  props.studentBalance >=
                  +props.totalShopping.split(".").join("")
                    ? false
                    : true
                }
                onChange={(e) => {
                  setValue({ ...value, inputTotalPrice: e as number });
                }}
              />
            </div>
            {props.studentBalance <
              +props.totalShopping.split(".").join("") && (
              <p className="text-sm text-pink-700">Saldo Anda tidak cukup.</p>
            )}
            <div className="flex justify-end">
              <ModalConfirmPayment
                handleConfirmPayment={() => handleConfirmPayment()}
                totalShopping={props.totalShopping}
                input={handleFormatPrice(String(value.inputTotalPrice))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCart;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { id } = ctx.query;

  const student = await prisma.student.findUnique({
    where: {
      student_id: id as string,
    },
    select: {
      balance: true,
      id: true,
      canteen: {
        select: {
          balance: true,
          id: true,
        },
      },
    },
  });

  if (!student) {
    return {
      notFound: true,
    };
  }

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

  const allCartItem = await prisma.cartItem.findMany({
    select: {
      id: true,
      quantity: true,
    },
  });

  let cartItemQuantity: number = 0;
  let cartPerItemQuantity: any = {};
  let totalShopping: any = 0;
  cart[0].cart_item.map((item: any) => {
    cartPerItemQuantity[item.product.id] = item.quantity;
    cartItemQuantity += item.quantity as number;
    totalShopping += ((item.quantity as number) *
      item.product.price) as number as number;
  });
  totalShopping = String(totalShopping)
    .split("")
    .reverse()
    .join("")
    .match(/.{1,3}/g)
    ?.join(".")
    .split("")
    .reverse()
    .join("");

  return {
    props: {
      cartItem: cart[0].cart_item,
      cartItemQuantity: cartItemQuantity,
      cartPerItemQuantity: cartPerItemQuantity,
      totalShopping: totalShopping,
      studentBalance: student.balance,
      studentId: student.id,
      canteenId: student.canteen?.id,
      canteenBalance: student.canteen?.balance,
      allCartItem: allCartItem,
    },
  };
}
