import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { AlertColor } from '@mui/material'
import './styles/alert.less'

interface IProps {
  open: boolean
  onClose: any
  severity?: AlertColor
  message?: string
}

const Alert = (props: IProps) => {
  const { open, onClose, severity = 'info', message = '' } = props
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MuiAlert
        elevation={6}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        onClose={onClose}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  )
}

export default Alert
