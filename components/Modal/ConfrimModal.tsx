import { memo } from 'react'
import './styles/modal.less'
import OvalButton from '../Button/OvalButton'

interface IProps {
  title: string
  content: string
  onClose: Function
  onConfirm: Function
  cancelText?: string
  confirmText?: string
}

const ConfrimModal = memo((props: IProps) => {
  const { title, content, onClose, onConfirm, cancelText, confirmText } = props

  return (
    <>
      <div className="demo-modal">
        <div className="modal-panel">
          <h1>{title}</h1>
          <p>{content}</p>
          <div className="func">
            <OvalButton
              title={cancelText ?? 'Cancel'}
              className="cancel-btn"
              onClick={onClose}
            />
            <OvalButton title={confirmText ?? 'Confirm'} onClick={onConfirm} />
          </div>
        </div>
      </div>
    </>
  )
})

export default ConfrimModal
