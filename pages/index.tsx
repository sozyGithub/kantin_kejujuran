import { Divider, TextInput } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import { Search } from "tabler-icons-react";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kantin Kejujuran</title>
      </Head>

      <Navbar />

      <div className="">
        <div className="max-w-6xl mx-auto w-full">
          <TextInput placeholder="Cari Item" icon={<Search />} p="sm" />
          <Divider variant="dashed" />
        </div>
      </div>
    </>
  );
};

export default Home;
