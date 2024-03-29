import './styles/funcModal.less'
import OvalButton from '../Button/OvalButton'
import { ReactNode } from 'react'

interface IProps {
  title: string
  onConfirm?: Function
  onClose: Function
  disabled?: boolean
  hideFotter?: boolean
  children?: ReactNode
}

const FuncModal = (props: IProps) => {
  const { title, disabled, children, hideFotter } = props
  return (
    <div className="func-modal">
      <div className="content">
        <svg
          className="i-close"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={props.onClose.bind(this, null)}
        >
          <path
            d="M12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41L12.59 0Z"
            fill="#2E3A59"
          />
        </svg>
        <h1 className="content-title">{title}</h1>
        {children}
        {!hideFotter && (
          <div className="content-fotter">
            <OvalButton
              title="Cancel"
              className="c-btn cancel-btn"
              onClick={props.onClose}
            />
            <OvalButton
              title="Confirm"
              className="c-btn"
              disabled={disabled}
              onClick={props.onConfirm}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncModal
