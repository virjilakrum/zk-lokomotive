import React, {Fragment} from 'react';
import logo from './logo.svg';
import './App.css';
import Arweave from 'arweave/web';
import jwkToPem from 'jwk-to-pem'
import { Grid, Typography, AppBar, Toolbar, Paper, Tab, Tabs, Dialog, CircularProgress, DialogContent, Button } from '@material-ui/core';
import { readWallet, readBuffer} from './utils/ReadWallet'
import CRYPTO from "crypto-js"
import { encryptData, decryptData, base64ToArrayBuffer} from './utils/crypto'
import HomeDash from './components/HomeDash'
import ListFiles from './components/ListFiles'
import WalletUpload from './components/WalletUpload'
import FileMailer from './components/FileMailer'
import ListMailFiles from './components/ListMailFiles';
import { getArPublicKey, getUserPrivateData, getUserArReceiveList, getUserArSendList } from './utils/arUtils';
import { arweave } from './utils/arUtils'


class App extends React.Component{
  state = {
    valueTab:0,
    walletLoad:false,
    walletData:'',
    arUserAddress:'',
    arUserBalance:'',
    userArPublicKey:false,
    //File Upload
    fileLoading:false,
    fileBuffer:'',
    fileBufferName:'',
    fileUploadStatus:false,
    fileEncryptStatus:false,
    fileEncryptData:'',
    //File List
    listFiles:false,
    listFilesData:[],
    listSendFilesData:[],
    listReceiveFilesData:[],
    //tx encrypt my data
    txFee:'',
    transaction:'',
    modalTx:false,
    //tx submit public key
    publicKeyTxFee:'',
    modalSubmitPublicKey:false,
    txSubmitPublicKey:''
  }

  handleTabChange = (event, value) => {
    this.setState({ valueTab:value })
  }  

  handleWalletUpload = async(e) => {
    try{
      this.setState({fileLoading:true})
      const rawWallet = await readWallet(e.target.files[0])
      const walletFile = JSON.parse(rawWallet)
      const address = await arweave.wallets.jwkToAddress(walletFile)
      const rawBalance =  await arweave.wallets.getBalance(address)
      const balance = await arweave.ar.winstonToAr(rawBalance)
      const [
        userPrivateDataList, 
        arPublicKey, 
        listReceiveFilesData, 
        listSendFilesData
      ] = await Promise.all([getUserPrivateData(address), 
                            getArPublicKey(address), 
                            getUserArReceiveList(address),
                            getUserArSendList(address)
                          ])
      this.setState({listSendFilesData, listReceiveFilesData, listFilesData: userPrivateDataList,walletLoad:true, walletData:walletFile, arUserAddress:address, arUserBalance: balance, userArPublicKey:arPublicKey, fileLoading:false})
    }catch(err){
      console.log(err)
      this.setState({fileLoading:false})
      alert('Error on wallet loading')
      return
    }
  }

  handleFileUpload = async(e) => {
    try{
      this.setState({fileLoading:true, fileEncryptStatus:false, fileEncryptData:'',fileName:''})
      const resultbuffer = await readBuffer(e.target.files[0])
      const privatePem = await jwkToPem(this.state.walletData,{private:true})
      const dataEncryptResult = await encryptData(CRYPTO.lib.WordArray.create(resultbuffer.data), privatePem)
      const fileEncryptData = await dataEncryptResult.toString()
      this.setState({fileEncryptStatus:true,fileName:resultbuffer.name, fileEncryptData, fileLoading:false})
    }catch(err){
      console.log(err)
      this.setState({fileLoading:false})
    }
  }

  createEncryptMyData = async() =>{
    try{
      this.setState({fileLoading:true})
      const { fileEncryptData} = this.state
      const data = fileEncryptData   
      let transaction = await arweave.createTransaction({
          data
      }, this.state.walletData);
      transaction.addTag('App-Name', 'ar-crypto-storage');
      const txFee = await arweave.ar.winstonToAr(transaction.reward)
      this.setState({transaction, txFee, fileLoading:false, modalTx:true})
    }catch(err){
      console.log(err)
      this.setState({modalTx:false, fileLoading:false})
      alert('Error Generating the transaction')
    }

  }

  openModalSubmitPublicKey = async() => {
    try{
      this.setState({fileLoading:true})
      const publicPem = await jwkToPem(this.state.walletData)
      let transaction = await arweave.createTransaction({
        data:publicPem
      }, this.state.walletData);
      transaction.addTag('App-Name', 'ar-crypto-storage-public-key');
      const publicKeyTxFee = await arweave.ar.winstonToAr(transaction.reward)
      this.setState({fileLoading:false, publicKeyTxFee, txSubmitPublicKey:transaction, modalSubmitPublicKey:true})
    }catch(err){
      console.log(err)
      this.setState({fileLoading:false, modalSubmitPublicKey:false})
      alert('Failed on generate Public Key')
    }
  }

  submitPublicKey = async() => {
    try{
      this.setState({fileLoading:true})
      const transaction = this.state.txSubmitPublicKey
      await arweave.transactions.sign(transaction, this.state.walletData);
      const response = await arweave.transactions.post(transaction);
      console.log(transaction.id)
      let {status} = await arweave.transactions.getStatus(transaction.id)
      console.log(status)
      if(status === 202 || status === 200){
        alert('Public Key Register on Arweave')
      }else{
        alert('Failed to Upload')
      }
      this.setState({fileLoading:false, modalSubmitPublicKey:false})
    }catch(err){
      console.log(err)
      this.setState({fileLoading:false})
      alert('Failed on Upload to Arweave')
    }
  }

  sendDataArweave = async() => {
    try{
      this.setState({fileLoading:true})
      const { transaction} = this.state
      await arweave.transactions.sign(transaction, this.state.walletData);
      const response = await arweave.transactions.post(transaction);
      alert('Data Send')
      this.setState({fileLoading:false, modalTx:false, transaction:''})
    }catch(err){
      console.log(err)
      this.setState({fileLoading:false, modalTx:false})
      alert('Failed on Upload to Arweave')
    }
  }
   
  decryptAndDownloadFromArweave = async(txId) => {
    try{
      console.log(txId)
      const transaction = await arweave.transactions.get(txId)
      const x = await transaction.get('data', {decode: true, string: true})
      const privatePem = await jwkToPem(this.state.walletData,{private:true})
      const decryptDataResult = await decryptData(x, privatePem)
      const decryptBase64 = await decryptDataResult.toString(CRYPTO.enc.Base64)
      const result = await base64ToArrayBuffer(decryptBase64)
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${txId}.file`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(err){
      console.log(err)
    }
  }

 
  handleCloseTxModal = () => this.setState({modalTx:false})

  handleCloseTxPublicKeyModal = () => this.setState({modalSubmitPublicKey:false})

  render(){
    return(
      <Fragment>
        <AppBar position="fixed" style={{alignItems:"center"}}><Toolbar>
          <Typography align="center" variant="h6">Arweave Secure Crypto Storage</Typography>
        </Toolbar></AppBar>    
        <Grid container style={{ minHeight:'100vh', marginTop:30,paddingTop:30, backgroundColor:"#ecf0f1"}} justify="center" alignContent='center' direction="column">
          {this.state.walletLoad ? 
          <Grid style={{padding:10}} justify="center" alignContent='center' direction="column">
          <Typography align="center" variant="h6">{this.state.arUserAddress}</Typography>
          <Typography align="center" variant="h6">{this.state.arUserBalance} AR</Typography>

          {this.state.userArPublicKey ?
          <Typography align="center" variant="overline">Public Key Registered</Typography>
          :
          <Button variant="contained" onClick={this.openModalSubmitPublicKey}>Register your Wallet Public Key for receive files</Button>
          }
          <Paper>
          <Tabs
          value={this.state.valueTab}
          indicatorColor="primary"
          textColor="primary"
          name="valueTab"
          onChange={this.handleTabChange}
        >
          <Tab label="My Storage" />
          <Tab label="File Mail" />
          <Tab label="Send Data" />
        </Tabs>
          </Paper>
          <Paper style={{padding:20}}>
          {this.state.valueTab === 0 && 
          <Fragment>
          <HomeDash uploadFile={this.createEncryptMyData} state={this.state} handleFileUpload={this.handleFileUpload} encryptFile={this.encryptFile} />
          <ListFiles listData={this.state.listFilesData} decryptAndDownload={this.decryptAndDownloadFromArweave} />
          </Fragment>
          }
          {this.state.valueTab === 1 && 
            <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
            <ListMailFiles listData={this.state.listSendFilesData} title={"Files Send"} />
            <ListMailFiles listData={this.state.listReceiveFilesData} download={true} walletData={this.state.walletData} title={"File Receive"} />
            </Grid>
          }
          {this.state.valueTab === 2 && 
          <FileMailer state={this.state}/>
          }
          </Paper>
          </Grid>
          :
          <WalletUpload handleWalletUpload={this.handleWalletUpload} />
          }
          <Dialog open={this.state.fileLoading}><DialogContent><CircularProgress/></DialogContent></Dialog>

          <Dialog open={this.state.modalTx} onClose={this.handleCloseTxModal}><DialogContent>
                    <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
                        <Typography>File Encrypted:</Typography>
                        <Typography>{this.state.fileName}</Typography>
                        <Typography>Transaction Fee:</Typography>
                        <Typography>{this.state.txFee}</Typography>
                        <Button variant="contained" onClick={this.sendDataArweave}>Encrypt and upload data</Button>

                    </Grid>     
                </DialogContent></Dialog>

                <Dialog open={this.state.modalSubmitPublicKey} onClose={this.handleCloseTxPublicKeyModal}><DialogContent>
                    <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
                        <Typography>Transaction Fee:</Typography>
                        <Typography>{this.state.publicKeyTxFee}</Typography>
                        <Button variant="contained" onClick={this.submitPublicKey}>Register your Wallet Public Key for receive files</Button>

                    </Grid>     
                </DialogContent></Dialog>
        </Grid>
        </Fragment>
    )
  }

}

export default App;
