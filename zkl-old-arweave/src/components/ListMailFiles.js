import React from 'react'
import { Grid, Typography, ListSubheader, IconButton, Menu, 
Tooltip, List, ListItem, ListItemText, ListItemSecondaryAction,
Dialog, DialogContent, CircularProgress
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/Unarchive';
import { decryptFromArweave } from '../utils/crypto';

class ListMailFiles extends React.Component{
  state = {
    fileLoading:false
  }



  render(){
   const { listData, walletData, title, download } = this.props
   const { anchorEl } = this.state;
   const open = Boolean(anchorEl);
    return(
      <Grid container direction="column" justify="center" alignContent="center" alignItems="center">
        <List dense subheader={<ListSubheader>{title}</ListSubheader>}>
          {listData.map(({txId, address}) => (
                   <ListItem key={txId} button>
                   <ListItemText primary={txId} secondary={address} />
                   {download &&
                   <ListItemSecondaryAction>
                   <div>
        <Tooltip title="Decrypt and Download" placement="top">
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={async () => 
            {
              try{
                this.setState({fileLoading:true})
                await decryptFromArweave(txId, walletData)
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
                   }
                 </ListItem>

          ))}
        </List>
        <Dialog open={this.state.fileLoading}><DialogContent><CircularProgress/></DialogContent></Dialog>
        </Grid>

    )
}
}

export default ListMailFiles