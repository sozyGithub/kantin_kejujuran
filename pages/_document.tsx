import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html data-color-mode="light">
        <Head />
        <body className="bg-slate-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
