import React from 'react'
import { Grid, Typography, Dialog, DialogContent, CircularProgress, InputBase, Button, Divider } from '@material-ui/core';
import { readBuffer } from '../utils/ReadWallet';
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'
import jwkToPem from 'jwk-to-pem'
import Arweave from 'arweave/web';
import NodeRSA from 'node-rsa'
import { encryptData, decryptData, base64ToArrayBuffer } from '../utils/crypto';
import CRYPTO from "crypto-js"
import { getArPublicKey } from '../utils/arUtils';

const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 80,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
})


class FileMailer extends React.Component{
    state = {
        //file upload
        fileLoading:false,
        fileUpload:false,
        fileRawData:'',
        fileName:'',
        //user address and public key
        receiverArAddress:'',
        receiverPublicKey:'',
        receiverPushAddress:'',
        receiverNoPublicKey:false,
        receiverPublicKeyValid:false
    }

    change = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleFileUpload = async(e) => {
        try{
            this.setState({fileLoading:true, fileUpload:false, fileName:'', fileRawData:''})
            const { data, name  } = await readBuffer(e.target.files[0])
            this.setState({fileRawData:data,fileUpload:true, fileLoading:false, fileName:name})
        }catch(err){
            console.log(err)
            this.setState({fileLoading:false, fileUpload:false, fileName:'', fileRawData:''})
            alert('Error on File Reading')
        }
    }

    getUserPublicKey = async() =>{
        try{
            this.setState({fileLoading:true})
            const {receiverArAddress} = this.state
            this.setState({receiverNoPublicKey:false, receiverPublicKey:false, receiverPublicKeyValid:false})
            const publicKey = await getArPublicKey(receiverArAddress)
            console.log(publicKey)
            if(!publicKey){
                this.setState({receiverNoPublicKey:true, fileLoading:false})
                alert('Not find Public Key')
            }else{
                this.setState({receiverPublicKey:publicKey, receiverPushAddress:receiverArAddress, receiverPublicKeyValid:true, fileLoading:false})
            }
        }catch(err){
            console.log(err)
            alert('Not find Public Key')
            this.setState({receiverNoPublicKey:false, receiverPublicKey:false, receiverPushAddress:'', receiverPublicKeyValid:false, fileLoading:false})
        }
    }

    encryptData = async() => {
        try{
            //Generate Private Key for Encrypt Data
            const walletKey = await arweave.wallets.generate();
            const privateEncryptionKey = await jwkToPem(walletKey,{private:true})

            //Encrypt data with the generate private key
            const rawEncryptResult = await encryptData(CRYPTO.lib.WordArray.create(this.state.fileRawData), privateEncryptionKey)
            const fileEncryptData = await rawEncryptResult.toString()    

            //Encrypt encryption private key with public Key of the user
            let key = await new NodeRSA();
            key.importKey(this.state.receiverPublicKey, "pkcs8-public")
            const encryptPvKey = await key.encrypt(privateEncryptionKey, 'base64')

            const data = JSON.stringify({
                encryptPvKey,
                fileEncryptData
            })
            //Generate Transaction
            let transaction = await arweave.createTransaction({
                data
            }, this.props.state.walletData);
            transaction.addTag('App-Name', 'ar-crypto-storage-mail');
            transaction.addTag('Destination', this.state.receiverPushAddress);
            const txFee = await arweave.ar.winstonToAr(transaction.reward)
            this.setState({transaction, txFee, modalTx:true})
        }catch(err){
            console.log(err)
            alert('Error on Encryption')
        }
    }

    confirmSendEncryptData = async() => {
        try{
            this.setState({fileLoading:true})
            const{transaction} = this.state
            await arweave.transactions.sign(transaction, this.props.state.walletData);   
            console.log(transaction.id) 
            const response = await arweave.transactions.post(transaction);
            console.log(response)
            this.setState({fileLoading:false, modalTx:false})
            alert('Transaction Send')

        }catch(err){
            console.log(err)
            this.setState({fileLoading:false, modalTx:false})
        }
  
    }

    
    handleCloseTxModal = () => this.setState({modalTx:false})

    render(){
        return(
            <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
                <Typography align="center" style={{padding:5}} variant="body2">Upload the file that you want to send</Typography>
                <input style={{paddingBottom:15, maxWidth:350}} type="file" onChange={ e => this.handleFileUpload(e)} />
                <Typography>Receiver Address:</Typography>
                <InputBase
                      id="receiverArAddress"
                      name="receiverArAddress"
                      onChange={e => this.change(e)}
                      value={this.state.receiverArAddress}
                      classes={{
                        root: this.props.classes.bootstrapRoot,
                        input: this.props.classes.bootstrapInput,
                      }}                  
                />
                <Button variant="contained" onClick={this.getUserPublicKey}>Get Public Key</Button>
               
                <Grid container style={{padding:15}} direction="column" justify="center" alignContent="center" alignItems="center">
                    <Divider component="middle" />
                    <Typography>File Loaded:</Typography>
                    <Typography>{this.state.fileUpload ? this.state.fileName : "No File Load" }</Typography>
                    <Typography>Receiver Address:</Typography>
                    <Typography>{this.state.receiverPublicKeyValid ? this.state.receiverPushAddress : "No Address Public Key Load"}</Typography>
                    {(this.state.receiverPublicKeyValid && this.state.receiverPushAddress ? 
                    <Button variant="contained" onClick={this.encryptData}>Encrypt and Send File</Button>
                    :
                    <Button variant="contained" disabled>Encrypt File</Button>

                    )}

                </Grid>
              
                <Dialog open={this.state.fileLoading}><DialogContent><CircularProgress/></DialogContent></Dialog>

                <Dialog open={this.state.modalTx} onClose={this.handleCloseTxModal}><DialogContent>
                    <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
                        <Typography>File Encrypted:</Typography>
                        <Typography>{this.state.fileName}</Typography>
                        <Typography>Destination:</Typography>
                        <Typography>{this.state.receiverPushAddress}</Typography>
                        <Typography>Transaction Fee:</Typography>
                        <Typography>{this.state.txFee}</Typography>
                        <Button variant="contained" onClick={this.confirmSendEncryptData}>Send Encrypted Data</Button>

                    </Grid>     
                </DialogContent></Dialog>

            </Grid>
        )
    }

}

export default withStyles(styles, { withTheme: true })(FileMailer)
