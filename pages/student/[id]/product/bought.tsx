import { Divider } from "@mantine/core";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import { getSession } from "next-auth/react";
import SidebarStudentDashboard from "../../../../components/SidebarStudentDashboard";
import { prisma } from "../../../../lib/prisma";

type ProductType = {
  name: string;
  image: string;
  price: number;
};

type BoughtProductsType = {
  buyTime: string;
  quantity: number;
  product: ProductType;
};

interface StudentBoughtProductProps {
  boughtProducts: Array<BoughtProductsType>;
}

const StudentBoughtProduct: NextPage<StudentBoughtProductProps> = (props) => {
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
      <SidebarStudentDashboard>
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="font-semibold text-gray-600 text-xl">Produk Dibeli</h2>
          <Divider />
          {props.boughtProducts.map((product, i: number) => (
            <div key={i} className="space-y-2">
              <div className="flex flex-row space-x-2 items-center">
                <div className="bg-white p-2 rounded-xl max-w-max shadow border border-gray-300">
                  <p className="text-xs text-gray-500">{product.buyTime}</p>
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
                    Dibeli:{" "}
                    <span className="font-semibold">{product.quantity}</span>
                  </p>
                  <p className="text-sm">
                    Total Harga:{" "}
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
          {props.boughtProducts.length === 0 && (
            <div className="max-w-max mx-auto bg-white shadow border border-gray-300 rounded-md p-2 my-5">
              <p className="text-center text-gray-600 font-semibold">
                Tidak ada produk.
              </p>
            </div>
          )}
        </div>
      </SidebarStudentDashboard>
    </>
  );
};

export default StudentBoughtProduct;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // get student session
  const session = await getSession({ req });

  // fetch bought products from db
  const boughtProductsDB = await prisma.boughtProduct.findMany({
    orderBy: {
      buyTime: "desc",
    },
    where: {
      student: {
        student_id: session?.user?.student_id,
      },
    },
    select: {
      buyTime: true,
      quantity: true,
      product: {
        select: {
          name: true,
          image: true,
          price: true,
        },
      },
    },
  });

  // changing DateTime format to string on buyTime
  const boughtProducts: Array<BoughtProductsType> = [];
  boughtProductsDB.map((product) => {
    boughtProducts.push({
      buyTime: product.buyTime?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })!,
      quantity: product.quantity!,
      product: {
        name: product.product?.name!,
        image: product.product?.image!,
        price: product.product?.price!,
      },
    });
  });

  return {
    props: {
      boughtProducts,
    },
  };
};
