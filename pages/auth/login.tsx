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
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Home, X } from "tabler-icons-react";
import { z } from "zod";

const schema = z.object({
  student_id: z.string(),
  password: z.string(),
});

const Login: NextPage = () => {
  const router = useRouter();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      student_id: "",
      password: "",
    },
  });

  const handleLogin = async (values: any) => {
    const res = await signIn("credentials", {
      student_id: values.student_id,
      password: values.password,
      redirect: false,
    });
    if (res && res["error"]) {
      showNotification({
        title: "Masuk Gagal!",
        message: "ID siswa atau sandi salah",
        icon: <X />,
        color: "red",
      });

      return;
    }

    // redirect to the home page if success
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center flex-col justify-center h-screen p-2 space-y-2">
        <div className="w-content shadow rounded-full cursor-pointer">
          <Link href="/">
            <Avatar radius="xl">
              <Home />
            </Avatar>
          </Link>
        </div>
        <div className="max-w-sm w-full bg-white/70 p-5 rounded-md backdrop-blur shadow">
          <form
            className="space-y-4"
            onSubmit={form.onSubmit((values) => handleLogin(values))}
          >
            <p className="text-center font-bold text-gray-600 text-xl">Masuk</p>
            <TextInput
              placeholder="ID"
              label="ID Siswa"
              required
              {...form.getInputProps("student_id")}
            />
            <PasswordInput
              placeholder="Sandi"
              label="Sandi"
              required
              {...form.getInputProps("password")}
            />
            <Button variant="light" fullWidth type="submit">
              Masuk
            </Button>
            <Divider labelPosition="center" label="atau" />
            <Paper p="xs" className="border border-gray-200">
              <p className="text-sm">
                Belum punya akun?{" "}
                <Link href="/auth/register">
                  <a className="hover:underline hover:text-gray-500">
                    Register
                  </a>
                </Link>
              </p>
            </Paper>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
