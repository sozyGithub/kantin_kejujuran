import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Image,
  LoadingOverlay,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Filter,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "tabler-icons-react";
import DrawerProductDetail from "../components/DrawerProductDetail";
import Navbar from "../components/Navbar";
import { prisma } from "../lib/prisma";

const Home: NextPage = (props: any) => {
  const { data: session }: any = useSession();

  const router = useRouter();

  const [value, setValue] = useState({
    cart: props.cartData,
    totalProduct: props.totalProduct,
    search: "",
    filter: "terbaru",
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
  const handleFilterProduct = (filter: string) => {
    router.push(`/?filter=${filter}`);
  };

  const handleSearchProduct = () => {
    router.push(`/?search=${value.search}`);
    setValue({ ...value, search: "" });
  };

  const handleAddCart = async (product: any) => {
    setValue({ ...value, loading: true });
    let isCartItemExist = false;
    let cartItemID;
    product.CartItem.map((item: any) => {
      if (
        item.productId === product.id &&
        session?.user?.cart === item.cartId
      ) {
        isCartItemExist = true;
        cartItemID = item.id;
        return;
      }
    });
    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[product.id] + 1,
        update: "quantity",
      };
      const dataCreate = {
        quantity: value.cart[product.id] + 1,
        product: product.id,
        cart: session?.user?.cart,
      };
      await fetch("/api/cartitem", {
        method: isCartItemExist ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isCartItemExist ? dataUpdate : dataCreate),
      });
      let _ = value;
      _.cart[product.id]++;
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
  const handleRemoveCart = async (product: any) => {
    setValue({ ...value, loading: true });
    let isCartItemExist = false;
    let cartItemID;
    product.CartItem.map((item: any) => {
      if (
        item.productId === product.id &&
        session?.user?.cart === item.cartId
      ) {
        isCartItemExist = true;
        cartItemID = item.id;
        return;
      }
    });

    try {
      const dataUpdate = {
        id: cartItemID,
        quantity: value.cart[product.id] - 1,
        update: "quantity",
      };
      const dataCreate = {
        quantity: value.cart[product.id] - 1,
        product: product.id,
        cart: "cl4tzsq1l02050ow093m56ztk",
      };
      await fetch("/api/cartitem", {
        method: isCartItemExist ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isCartItemExist ? dataUpdate : dataCreate),
      });
      let _ = value;
      _.cart[product.id]--;
      _.totalProduct--;
      setValue({ ..._ });
    } catch (error) {
      showNotification({
        title: "Kesalaha!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
    }
    setValue({ ...value, loading: false });
  };
  return (
    <>
      <Head>
        <title>Kantin Kejujuran</title>
      </Head>

      <Navbar quantity={value.totalProduct} />

      <div className="">
        <LoadingOverlay visible={value.loading} />
        <div className="max-w-6xl mx-auto w-full space-y-4 p-3">
          <div className="flex flex-row items-center">
            <TextInput
              placeholder="Cari Produk"
              icon={<Search size={15} />}
              p="sm"
              className="flex-1"
              value={value.search}
              onChange={(e) => {
                setValue({ ...value, search: e.currentTarget.value });
              }}
            />
            <ActionIcon
              variant="light"
              onClick={handleSearchProduct}
              disabled={value.search ? false : true}
            >
              <Search size={15} />
            </ActionIcon>
          </div>
          <Divider variant="dashed" />
          {props.search && (
            <div>
              <p>
                Hasil untuk: "<b>{props.search}</b>"
              </p>
            </div>
          )}
          <div className="w-32">
            <Select
              placeholder="Filter"
              data={[
                { value: "terbaru", label: "Terbaru" },
                { value: "terlama", label: "Terlama" },
                { value: "a-z", label: "A-Z" },
                { value: "z-a", label: "Z-A" },
              ]}
              icon={<Filter size={15} />}
              value={value.filter}
              onChange={(e) => {
                handleFilterProduct(e as string);
                setValue({ ...value, filter: e as string });
              }}
            />
          </div>
          <Grid>
            {props.products.map((product: any, i: number) => (
              <Grid.Col xs={6} sm={4} md={3} lg={3} key={i}>
                <Card shadow="sm">
                  <Card.Section>
                    <Image src={product.image} height={180} />
                  </Card.Section>
                  <div className="overflow-hidden h-20 py-2">
                    <p className="text-gray-600 font-semibold text-lg leading-tight uppercase">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 py-1">
                      {product.createdAt}
                    </p>
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
                    <DrawerProductDetail product={product} />
                  </div>
                  {session && value.cart[product.id] > 0 && (
                    <Paper
                      className="border border-gray-200"
                      shadow="xs"
                      my="xs"
                      p="xs"
                    >
                      <p className="text-center">{value.cart[product.id]}</p>
                    </Paper>
                  )}
                  <div className="pt-2 flex flex-row space-x-2">
                    {session &&
                      value.cart[product.id] > 0 &&
                      product.quantity > 0 && (
                        <Button
                          variant="light"
                          color="red"
                          leftIcon={<Minus size={15} />}
                          fullWidth
                          onClick={() => handleRemoveCart(product)}
                        >
                          <ShoppingCart size={15} />
                        </Button>
                      )}
                    {session &&
                      value.cart[product.id] < product.quantity &&
                      product.quantity > 0 && (
                        <Button
                          variant="light"
                          color="indigo"
                          leftIcon={<Plus size={15} />}
                          fullWidth
                          onClick={() => handleAddCart(product)}
                        >
                          <ShoppingCart size={15} />
                        </Button>
                      )}
                  </div>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
          {props.products.length === 0 && (
            <div className="max-w-max mx-auto bg-white shadow border border-gray-300 rounded-md p-2">
              <p className="text-center text-gray-600 font-semibold">
                Tidak ada produk.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps({
  req,
  query,
}: GetServerSidePropsContext) {
  const session: any = await getSession({ req });

  let products: any;

  // creating filter logic
  let filterQuery: any = {};
  if (query.filter === "terlama") {
    filterQuery.createdAt = "asc";
  } else if (query.filter === "a-z") {
    filterQuery.name = "asc";
  } else if (query.filter === "z-a") {
    filterQuery.name = "desc";
  } else {
    filterQuery.createdAt = "desc";
  }

  if (session) {
    products = await prisma.product.findMany({
      orderBy: filterQuery,
      where: {
        NOT: {
          student: {
            student_id: session.user.student_id,
          },
        },
        OR: [
          {
            name: {
              contains: query.search ? (query.search as string) : "",
            },
          },
          {
            description: {
              contains: query.search ? (query.search as string) : "",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        quantity: true,
        price: true,
        createdAt: true,
        CartItem: {
          select: {
            productId: true,
            quantity: true,
            cartId: true,
            id: true,
          },
        },
      },
    });
  } else {
    products = await prisma.product.findMany({
      orderBy: filterQuery,
      where: {
        OR: [
          {
            name: {
              contains: query.search ? (query.search as string) : "",
            },
          },
          {
            description: {
              contains: query.search ? (query.search as string) : "",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        quantity: true,
        price: true,
        createdAt: true,
      },
    });
  }
  products.map((product: any) => {
    product.createdAt = product.createdAt?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  // generate id and quantity for the initial props
  const cartData: any = {};
  let totalProduct: number = 0;

  if (session) {
    const cart = await prisma.cart.findMany({
      where: {
        student: {
          student_id: session.user.student_id,
        },
      },
      include: {
        cart_item: {
          select: {
            product: {
              select: {
                id: true,
                quantity: true,
              },
            },
            productId: true,
            quantity: true,
          },
        },
      },
    });
    products.map((product: any) => {
      cartData[product.id] = 0;
    });
    cart[0].cart_item.map((item: any) => {
      cartData[item.productId] = item.quantity;
      // console.log(Math.min(item.quantity, item.product.quantity));
      // get total product in the cart
      totalProduct += Math.min(item.quantity, item.product.quantity);
    });
  }

  return {
    props: {
      products: products,
      cartData: cartData,
      totalProduct: totalProduct,
      search: query.search || "",
    },
  };
}
