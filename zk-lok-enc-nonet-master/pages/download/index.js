import Head from "next/head";
import Layout from "components/layout.js";
import Link from "next/link";
import { Component } from "react";

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = { code: "" };

    if (process.browser) {
      document.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          console.log("wow");
        }
      });
    }
  }

  handleMaxChars(e) {
    if (e.target.innerHTML.includes("<br>")) {
      e.target.innerHTML = e.target.innerHTML.replace("<br>", "");
    }

    this.setState({ code: e.target.innerHTML });

    if (e.which === 13) {
      document.querySelector(".button").click();
    }
    if (e.target.innerHTML.length >= 4 || e.which === 13) {
      e.preventDefault();
      return false;
    }
  }

  render() {
    return (
      <>
        <Layout>
          <Head>
            <title>DOWNLOAD</title>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>

          <main>
            <h2 style={{ color: "#3cd36c" }}>Your code</h2>
            <div
              className="textInput"
              contentEditable="true"
              type="text"
              onKeyUp={(e) => this.handleMaxChars(e)}
            ></div>
            <Link href={"/download/" + this.state.code}>
              <a className="button">Submit</a>
            </Link>
          </main>

          <style jsx>{`
            h1 {
              font-size: 130px;
              color: #65ffcc;
              margin: 0;
            }
            h2 {
              font-size: 50px;
              margin-top: 15vh;
            }
            .textInput {
              height: 162px;
              min-width: 250px;
              margin: 0 auto;
              font-size: 120px;
              font-family: korolev, sans-serif;
              border: none;
              background: #e8e8e8;
              border-radius: 20px;
              padding-left: 25px;
              text-align: center;
              line-height: 163px;
              width: max-content;
              padding-right: 35px;
            }
            .button {
              width: 250px;
            }
          `}</style>
        </Layout>
      </>
    );
  }
}
