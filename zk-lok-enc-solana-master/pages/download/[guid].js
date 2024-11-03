import { useRouter } from 'next/router'
import fs from 'fs-extra'
import Head from 'next/head'
import Layout from 'components/layout.js'

const downloadSuccess = (props) => {

    function getDownloadState() {
        let mainMessage;
        let icon = ( <i className="fas fa-times-circle"></i> );
        let secondaryMessage;

        if (!props.exists) {
            mainMessage = 'That code does not exist.';
            secondaryMessage = 'The download may have expired, or you may have typed the code incorrectly.';
        } else { 
            if (!props.finished) {
                mainMessage = 'Your download is still processing.';
                secondaryMessage = 'Please check back later.';
            } else {
                mainMessage = 'Your download will start soon!';
                secondaryMessage = ( <a onClick={(e) => cancelDownload(e)} href={`/api/download/${guid}`}>Click here to download right away</a> );
                icon = ( <i className="fas fa-cloud-download-alt"></i> );
            }
        }

        return {
            mainMessage: mainMessage,
            icon: icon,
            secondaryMessage: secondaryMessage
        }
    }

    function cancelDownload(e) {
        window.clearTimeout(downloadTimeout);
    }

    const router = useRouter()
    const { guid } = router.query
    var downloadTimeout; 

    if (process.browser) {
        if (props.exists && props.finished) {
            downloadTimeout = window.setTimeout(() => {
                window.location.href = `/api/download/${guid}`;
            }, 3000)
        }
    }

    var content = getDownloadState();

    return (
        <>
            <Head>
                <title>SHARE</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <Layout>
                <main>
                    <h2>{content['mainMessage']}</h2>
                    <h1>{content['icon']}</h1>
                    <h3>{content['secondaryMessage']}</h3>
                </main>
            </Layout>

            <style jsx>{`
                h1 {
                    width: 180px;
                    color: #65ffcc;
                    margin:0 auto;
                    font-size: 130px;
                }
                h2 {
                    font-size: 50px;
                    margin-top:15vh;
                }

                @media (max-width: 500px) {
                    h1 {
                        font-size: 110px;
                    }
                    h2 {
                        font-size: 40px;
                    }
                }
            `}</style>
        </>
    )
}

export async function getServerSideProps(context) {
    await clearOldFiles();

    const exists = fs.existsSync('uploads/' + context.params.guid + '.zip');
    const finished = !fs.existsSync('uploads/' + context.params.guid);

    return {
        props: { 
            'exists' : exists,
            'finished' : finished
        },
    }
}

const clearOldFiles = () => {

    fs.readdir('./uploads', function (err, files) {
        files.forEach(function (file) {
            const { birthtime } = fs.statSync('./uploads/' + file)
            const now = new Date().getTime();
            const endTime = new Date(birthtime).getTime() + 86400000;
            if (now > endTime) {
                fs.removeSync('./uploads/' + file, { recursive: true });
            }
        });
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
}


export default downloadSuccess
