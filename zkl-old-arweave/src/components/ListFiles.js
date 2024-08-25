import React from 'react'
import { Grid, Typography, ListSubheader, IconButton, Menu, 
Tooltip, List, ListItem, ListItemText, ListItemSecondaryAction,
Dialog, DialogContent, CircularProgress

} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/Unarchive';

class ListFiles extends React.Component{
  state = {
    fileLoading:false
  }


  render(){
    const { listData, decryptAndDownload } = this.props
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return(
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
        <List dense subheader={<ListSubheader>My Files</ListSubheader>}>
        {(listData.length === 0) ? 
        <Typography>No Files</Typography>
        :
        listData.map((txId) => (
                   <ListItem key={txId} button>
                   <ListItemText>
                   <Typography>{txId}</Typography>
                   </ListItemText>
                   <ListItemSecondaryAction>
                   <div>
        <Tooltip title="Decrypt and Download" placement="top">
        <IconButton
          onClick={async () => 
            {
              try{
                this.setState({fileLoading:true})
                await decryptAndDownload(txId)
                this.setState({fileLoading:false})
              }catch(err){
                this.setState({fileLoading:false})
              }
            }              
            }
        >
          <MoreVertIcon />
        </IconButton>
        </Tooltip>
        
      </div>
                   </ListItemSecondaryAction>
                 </ListItem>

          ))}
        </List>
        <Dialog open={this.state.fileLoading}><DialogContent><CircularProgress/></DialogContent></Dialog>

        </Grid>

    )
}
}

export default ListFiles