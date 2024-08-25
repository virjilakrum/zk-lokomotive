import CRYPTO from "crypto-js"
import { arweave } from "./arUtils";
import jwkToPem from 'jwk-to-pem'
import NodeRSA from 'node-rsa'

const encryptData = async(data, pass) => {
    var cipherWallet= await CRYPTO.AES.encrypt(data, pass)
    return cipherWallet
}
 
const decryptData = async(data, pass) => {
    var bytes  = await CRYPTO.AES.decrypt(data, pass);
    return bytes
    // const resultBase64 = await bytes.toString(CRYPTO.enc.Base64)
    // return resultBase64
}
const base64ToArrayBuffer = (base64) => {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

//Decrypt mailer data from arweave
const decryptFromArweave = async(txId, arWalletData) => {
    try{
        //Get private key from wallet and generate a new instance of nodeRSA
        const privateKey = await jwkToPem(arWalletData,{private:true})
        let rsa = await new NodeRSA();
        rsa.importKey(privateKey, "pkcs8-private")

        //Get transaction and push data
        const transaction = await arweave.transactions.get(txId)
        let dataTx = await JSON.parse( transaction.get('data', {decode: true, string: true}) )
       
        //Decrypt encryption key
        const encryptionKey = await rsa.decrypt(dataTx.encryptPvKey, 'utf8')
        //Decrypt data with encryption key
        const result = await decryptData(dataTx.fileEncryptData, encryptionKey)
        const resultBase64 = await result.toString(CRYPTO.enc.Base64)

        const resultt = await base64ToArrayBuffer(resultBase64)
        const url = window.URL.createObjectURL(new Blob([resultt]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${txId}.file`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return
    }catch(err){
        alert('Error')
        return
    }
}

const downloadLocalFile = (fileDataArrayBuffer) => {
    try{
        const url = window.URL.createObjectURL(new Blob([fileDataArrayBuffer]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `file.file`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }catch(err){
        console.log(err)
        alert('Error on download file')
    }

}

export{
    encryptData,
    decryptData,
    base64ToArrayBuffer,
    decryptFromArweave,
    downloadLocalFile
}