import React from 'react'
import { Grid, Typography } from '@material-ui/core'

const WalletUpload = ({handleWalletUpload}) => {
    return(
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
        <Typography align="center" style={{padding:5}} variant="body2">Upload you Arweave Wallet</Typography>
        <input style={{paddingBottom:15, maxWidth:350}} type="file" onChange={ e => handleWalletUpload(e)} />
      </Grid>
    )
  }

  export default WalletUpload