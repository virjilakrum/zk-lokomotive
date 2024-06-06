import React from 'react'
import { Grid, Typography, Button } from '@material-ui/core'


const HomeDash = ({handleFileUpload, uploadFile, state}) => {
    return(
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
        <Typography align="center" style={{padding:5}} variant="body2">Upload the file that you want to encrypt with your Wallet</Typography>
        <input style={{paddingBottom:15, maxWidth:350}} type="file" onChange={ e => handleFileUpload(e)} />
        {state.fileEncryptStatus && 
        <Grid container direction="column" style={{padding:10}} justify="center" alignContent="center" alignItems="center">
        <Typography>File Encrypted</Typography>
        <Button variant="contained" onClick={uploadFile}>Upload Encrypted Data to Arweave</Button>
        </Grid>
        }
      </Grid>
  
    )
  }


  export default HomeDash