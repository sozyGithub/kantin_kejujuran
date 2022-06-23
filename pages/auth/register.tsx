import {
  Paper,
  Avatar,
  Button,
  NumberInput,
  PasswordInput,
  Divider,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Check, Home, X } from "tabler-icons-react";
import { z } from "zod";
import IDInfoModalComp from "../../components/IDInfoModal";
import bcrypt from "bcryptjs";

const schema = z.object({
  student_id: z
    .string()
    .length(5, { message: "ID wajib 5 digit (0 - 9)." })
    .regex(/^[0-9]*$/, { message: "Hanya berupa angka." }),
  password: z.string().min(8, { message: "Sandi minimal 8 karakter." }),
});

const Register: NextPage = () => {
  const router = useRouter();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      student_id: "",
      password: "",
      confirm_password: "",
      name: "",
    },
  });

  const handleRegister = async (values: any) => {
    // validating password and confirm password
    if (values.password != values.confirm_password) {
      showNotification({
        title: "Register Gagal!",
        message: "Sandi dan konfirmasi sandi harus sama.",
        icon: <X />,
        color: "red",
        autoClose: 10000,
      });
      return;
    }

    // validating student_id based on the rules.
    const ID = values.student_id;
    const firstThreeDigitSum =
      parseInt(ID[0]) + parseInt(ID[1]) + parseInt(ID[2]);
    const lastDigit = parseInt(ID.substring(3));

    if (firstThreeDigitSum != lastDigit) {
      showNotification({
        title: "Register Gagal!",
        message:
          "ID siswa tidak sesuai ketentuan. Ketentuan dapat dilihat dengan menekan icon i pada bagian atas form",
        icon: <X />,
        color: "red",
        autoClose: 10000,
      });
      return;
    }

    // login data clean, continue to the next step

    // hashing password
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(values.password, salt, async function (err, hash) {
        // populate data
        const data = {
          student_id: values.student_id,
          name: values.name,
          password: hash,
        };
        // send the data to the database
        try {
          const res = await fetch("/api/student", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((r) => r.json());
          if (!res.error) {
            showNotification({
              title: "Register Sukses!",
              message: res.success,
              icon: <Check />,
              color: "green",
            });
            router.push("/auth/login");
          } else {
            showNotification({
              title: "Register Gagal!",
              message: res.error,
              icon: <X />,
              color: "red",
            });
          }
        } catch (error) {
          showNotification({
            title: "Register Gagal!",
            message: "Harap coba kembali beberapa saat lagi.",
            icon: <X />,
            color: "red",
          });
        }
      });
    });
  };

  return (
    <>
      <div className="flex items-center flex-col justify-center h-screen p-2 space-y-2">
        <div className="flex flex-row space-x-2">
          <div className="w-content shadow rounded-full cursor-pointer">
            <Link href="/">
              <Avatar radius="xl">
                <Home />
              </Avatar>
            </Link>
          </div>
          <IDInfoModalComp />
        </div>
        <div className="max-w-sm w-full bg-white/70 p-5 rounded-md backdrop-blur shadow">
          <form
            onSubmit={form.onSubmit((values) => handleRegister(values))}
            className="space-y-4"
          >
            <p className="text-center font-bold text-gray-600 text-xl">
              Register
            </p>
            <TextInput
              placeholder="ID"
              label="ID Siswa"
              required
              {...form.getInputProps("student_id")}
            />
            <TextInput
              placeholder="Nama"
              label="Nama"
              required
              {...form.getInputProps("name")}
            />
            <PasswordInput
              placeholder="Sandi"
              label="Sandi"
              required
              {...form.getInputProps("password")}
            />
            <PasswordInput
              placeholder="Konfirmasi Sandi"
              label="Konfirmasi Sandi"
              required
              {...form.getInputProps("confirm_password")}
            />
            <Button type="submit" variant="light" fullWidth>
              Register
            </Button>
            <Divider labelPosition="center" label="atau" />
            <Paper p="xs" className="border border-gray-200">
              <p className="text-sm">
                Sudah punya akun?{" "}
                <Link href="/auth/login">
                  <a className="hover:underline hover:text-gray-500">Masuk</a>
                </Link>
              </p>
            </Paper>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
