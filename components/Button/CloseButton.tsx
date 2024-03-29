import { Button } from "antd";
import "./styles/closeButton.less";

const CloseButton = (props: any) => {
  const { title, className, disabled, htmlType, onClick, onClose } = props;

  return (
    <Button
      className={`close-button ${className} ${disabled && "disabled-btn"}`}
      onClick={!disabled ? onClick : null}
      htmlType={htmlType}
    >
      <svg
        width="12"
        height="12"
        className="close-icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={!disabled ? onClose : null}
      >
        <path
          d="M10.6582 0.166992L5.99984 4.82533L1.3415 0.166992L0.166504 1.34199L4.82484 6.00033L0.166504 10.6587L1.3415 11.8337L5.99984 7.17533L10.6582 11.8337L11.8332 10.6587L7.17484 6.00033L11.8332 1.34199L10.6582 0.166992Z"
          fill="white"
        />
      </svg>
      {title}
    </Button>
  );
};

export default CloseButton;
