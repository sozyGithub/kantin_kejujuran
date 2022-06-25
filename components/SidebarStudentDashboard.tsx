import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  ScrollArea,
  Divider,
  Badge,
  ThemeIcon,
  Avatar,
} from "@mantine/core";
import { Box, Home, List } from "tabler-icons-react";
import NavLink from "./NavLink";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SidebarStudentDashboard(props: any) {
  const theme = useMantineTheme();
  const { data: session }: any = useSession();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="sm"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 250 }}
        >
          <Navbar.Section grow component={ScrollArea}>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="uppercase text-xs text-gray-500 font-semibold">
                  Produk
                </p>
                <Divider />
                <NavLink
                  href={`/student/${session?.user?.student_id}/product`}
                  className="flex flex-row space-x-2 p-2 hover:bg-sky-100 rounded-md cursor-pointer"
                >
                  <ThemeIcon variant="light">
                    <List />
                  </ThemeIcon>
                  <p className="flex-1 font-semibold">Produk Saya</p>
                </NavLink>
                <NavLink
                  href={`/student/${session?.user?.student_id}/new`}
                  className="flex flex-row space-x-2 p-2 hover:bg-sky-100 rounded-md cursor-pointer"
                >
                  <ThemeIcon variant="light">
                    <Box />
                  </ThemeIcon>
                  <p className="flex-1 font-semibold">Tambah Produk</p>
                </NavLink>
              </div>
            </div>
          </Navbar.Section>
          <Divider />
          <Navbar.Section>
            <div className="py-2">
              <NavLink
                className="p-1 flex flex-row space-x-2 items-center hover:cursor-pointer hover:bg-sky-100"
                href={`/student/${session?.user?.student_id}`}
                exact
              >
                <div>
                  <Avatar color="sky" radius="xl" />
                </div>
                <p className="flex-1 text-sm">{session?.user?.name}</p>
              </NavLink>
            </div>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={55} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <div className="flex flex-row items-center space-x-2">
              <Link href="/">
                <p className="text-xl font-bold text-gray-600 hidden md:block cursor-pointer ">
                  Kantin Kejujuran
                </p>
              </Link>
              <Link href="/">
                <p className="text-xl font-bold text-gray-600 md:hidden cursor-pointer">
                  KK
                </p>
              </Link>
              <Badge>Panel Siswa</Badge>
            </div>
          </div>
        </Header>
      }
    >
      {props.children}
    </AppShell>
  );
}
