import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>File Transfer Only Solana</title>
        <meta name="description" content="Selamlar" />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Home;
