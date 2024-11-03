import { useRouter } from 'next/router'
import { serverConfig } from 'server';
import Head from 'next/head'
import Layout from 'components/layout.js'
import Link from 'next/link'

const success = () => {
  const router = useRouter()
  const { guid } = router.query

  return (
    <>
      <Layout>
        <Head>
          <title>SHARE</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <main>
          <h2>Your code</h2>
          <h1>{guid}</h1>
          <Link href={`${serverConfig['uri']}/download/${guid}`}><h2><a>
            {serverConfig['uri']}/download/{guid}
          </a></h2></Link>
        </main>

      </Layout>

      <style jsx>{`
        h1 {
          font-size: 130px;
          color: #65ffcc;
          margin:0;
        }
        h2 {
          font-size: 50px;
          margin-top:15vh;
        }
        h2 a {
          border-bottom: 5px solid black;
        }
        h2 a:hover {
          border-bottom: 5px solid #65ffcc;
        }
        main {
          width:80%;
          margin: 0 auto;
          margin-top:15vh;
          text-align:center;
        }
        @media (max-width: 500px) {
          h1 {
              font-size: 110px;
          }
          h2 {
              font-size: 30px;
          }
          h2 a {
            line-height: 50px;
            word-wrap: break-word;
          }
        }
      `}</style>
    </>
  )
}

export default success