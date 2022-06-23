import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import { NotificationsProvider } from "@mantine/notifications";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionOptions={{ key: "mantine", prepend: false }}
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
          }}
        >
          <NotificationsProvider position="top-center" zIndex={2077} limit={2}>
            <NextNProgress />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
