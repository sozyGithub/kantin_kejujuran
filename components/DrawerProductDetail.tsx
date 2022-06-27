import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Image,
  Paper,
} from "@mantine/core";
import { useState } from "react";
import { InfoCircle, Plus, ShoppingCart } from "tabler-icons-react";

const DrawerProductDetail = ({ product }: any) => {
  const [opened, setOpened] = useState(false);
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
      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        title="Detail Produk"
        padding="md"
        size="xl"
        position="right"
        overlayBlur={3}
        className="overflow-auto"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">
            {product.name}
          </h2>
          <Divider my="sm" />
          <Image src={product.image} radius="md" />
          <p className="text-sm text-gray-500">{product.createdAt}</p>
          <div className="flex flex-row justify-between">
            <p className="font-bold">
              Rp{handleFormatPrice(String(product.price))}
            </p>
            <p>
              Tersisa: <span className="font-bold">{product.quantity}</span>
            </p>
          </div>
          <Paper p="xs" className="border border-gray-200" shadow="xs">
            <p className="text-gray-800">{product.description}</p>
          </Paper>
        </div>
      </Drawer>

      <ActionIcon
        variant="light"
        color="cyan"
        onClick={() => {
          setOpened(true);
        }}
        radius="xl"
      >
        <InfoCircle size={16} />
      </ActionIcon>
    </>
  );
};

export default DrawerProductDetail;
