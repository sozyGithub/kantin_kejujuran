import {
  Button,
  Divider,
  Image,
  LoadingOverlay,
  NumberInput,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Check, Link as LinkIcon, Upload, X } from "tabler-icons-react";
import DropzoneImage from "../../../components/DropzoneImage";
import SidebarStudentDashboard from "../../../components/SidebarStudentDashboard";
import { prisma } from "../../../lib/prisma";

const AddNewProduct: NextPage = (props: any) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [value, setValue] = useState({
    name: "",
    imageUpload: "",
    imageLink: "",
    tempImage: "",
    description: "",
    price: 0,
    currentSelection: "Unggah",
    quantity: 0,
    saving: false,
  });

  const handleImageUrl = (imageUrl: string) => {
    setValue({ ...value, imageUpload: imageUrl });
  };

  const handleAddProduct = async () => {
    setValue({ ...value, saving: true });
    const data = {
      name: value.name,
      image:
        value.currentSelection === "Unggah"
          ? value.imageUpload
          : value.imageLink,
      description: value.description,
      price: value.price,
      canteen: props.canteenId,
      quantity: value.quantity,
      student: session?.user?.student_id,
    };

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((r) => r.json());
      if (res.error) {
        showNotification({
          title: "Kesalahan!",
          message: res.error,
          color: "red",
          icon: <X />,
        });
        setValue({ ...value, saving: false });
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
        title: "Kesalahan!",
        message: "Silahkan coba beberapa saat lagi.",
        color: "red",
        icon: <X />,
      });
      setValue({ ...value, saving: false });
    }
  };

  return (
    <>
      <div>
        <SidebarStudentDashboard student_id={session?.user?.student_id}>
          <div className="max-w-4xl mx-auto space-y-4">
            {value.saving && <LoadingOverlay visible={true} />}
            <p className="font-semibold text-gray-600 text-xl">Tambah Produk</p>
            <Divider my="sm" />
            <TextInput
              label="Nama:"
              placeholder="Nama"
              maxLength={100}
              onChange={(e) => {
                setValue({ ...value, name: e.currentTarget.value });
              }}
            />
            <div className="space-y-2">
              <p className="text-sm">Gambar:</p>
              <Tabs
                variant="outline"
                onTabChange={(tabIndex: number, tabKey: string) => {
                  setValue({ ...value, currentSelection: tabKey });
                }}
              >
                <Tabs.Tab
                  label="Unggah"
                  icon={<Upload size={15} />}
                  tabKey="Unggah"
                >
                  {value.imageUpload ? (
                    <div className="space-y-2">
                      <Image
                        src={value.imageUpload}
                        height={200}
                        fit="contain"
                        caption="Pratinjau Gambar"
                        withPlaceholder
                      />
                      <Button
                        variant="light"
                        color="yellow"
                        fullWidth
                        onClick={() => {
                          setValue({ ...value, imageUpload: "" });
                        }}
                      >
                        Ubah
                      </Button>
                    </div>
                  ) : (
                    <DropzoneImage handleImageUrl={handleImageUrl} />
                  )}
                </Tabs.Tab>
                <Tabs.Tab
                  label="Tautan"
                  icon={<LinkIcon size={15} />}
                  tabKey="Link"
                >
                  <div className="space-y-2">
                    <TextInput
                      icon={<LinkIcon size={14} />}
                      placeholder="Tautan"
                      value={value.tempImage}
                      onChange={(e) => {
                        setValue({
                          ...value,
                          tempImage: e.currentTarget.value,
                          imageLink: "",
                        });
                      }}
                    />
                    {value.tempImage && !value.imageLink && (
                      <Button
                        variant="light"
                        color="lime"
                        onClick={() => {
                          setValue({
                            ...value,
                            imageLink: value.tempImage,
                          });
                        }}
                      >
                        Pratinjau
                      </Button>
                    )}
                    {value.imageLink && (
                      <Image
                        src={value.imageLink}
                        withPlaceholder
                        fit="contain"
                        height={200}
                        caption="Pratinjau Gambar"
                      />
                    )}
                  </div>
                </Tabs.Tab>
              </Tabs>
            </div>
            <Textarea
              placeholder="Deskripsi"
              label="Deskripsi:"
              autosize
              minRows={2}
              maxLength={255}
              onChange={(e) => {
                setValue({ ...value, description: e.currentTarget.value });
              }}
            />
            <NumberInput
              placeholder="Stok"
              label="Stok"
              min={0}
              onChange={(e) => {
                setValue({ ...value, quantity: e as number });
              }}
            />
            <div className="space-y-2">
              <p className="text-sm">Harga:</p>
              <div className="flex flex-row space-x-2 items-center">
                <p>Rp</p>
                <NumberInput
                  placeholder="Harga"
                  min={0}
                  className="flex-1"
                  onChange={(e) => {
                    setValue({ ...value, price: e as number });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <Button
                variant="light"
                onClick={() => {
                  handleAddProduct();
                }}
                disabled={
                  value.name &&
                  (value.imageLink || value.imageUpload) &&
                  value.description &&
                  value.price
                    ? false
                    : true
                }
              >
                Simpan
              </Button>
            </div>
          </div>
        </SidebarStudentDashboard>
      </div>
    </>
  );
};

export default AddNewProduct;

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

export async function getStaticProps() {
  const canteen = await prisma.canteen.findMany({
    select: {
      id: true,
    },
  });

  return {
    props: {
      canteenId: canteen[0].id,
    },
  };
}
