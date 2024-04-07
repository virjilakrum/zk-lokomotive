import Head from "next/head";
import TitleCard from "components/TitleCard/titleCard.js";
import Layout from "components/layout.js";
import Core from "components/core/core.js";
import LinkCard from "components/LinkCard/linkCard.js";
import { flags } from "socket.io/lib/namespace";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>zk-Lokomotive</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <div className="header">
          <img className="solana" src="/images/solana.svg" />
          <TitleCard
            title="zk-Lokomotive"
            text="File Transfer on solana network"
          />
          <div
            className="wallet-button-container"
            
          >
          <button className="wallet-button">Wallet Connection</button>
          <a
          href="https://github.com/virjilakrum/zk-lokomotive"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Github zk-Lokomotive</button>
        </a>
          </div>
        </div>
        <div
          className="fifty-grid center col-mobile  d-flex flex-wrap justify-center"
          style={{ color: "#3cd36c", display: "block", justifyContent: "center", width: "100%", height: "100%", overflow: "hidden"}}
        >
          <Core />
          {/* <LinkCard
            faStyles="fas fa-file-upload"
            title="Share Files on Solana ZK"
            body="Share files securely on Solana blockchain with zero-knowledge encryption"
            link="/share"
            linkText="Share Files"
          />
          <LinkCard
            faStyles="fas fa-file-download"
            title="Download Files on Solana ZK"
            body="Access your shared files securely on Solana blockchain. Simply provide the link or code you've received to retrieve them."
            link="/download"
            linkText="Retrieve Files"
          /> */}
        </div>
      </main>
    </Layout>
  );
}
