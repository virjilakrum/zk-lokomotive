import { Button } from "antd";
import "./styles/ovalButton.less";

const OvalButton = (props: any) => {
  const { title, className, disabled, htmlType, onClick, style } = props;

  return (
    <Button
      className={`oval-button ${className} ${disabled && "disabled-btn"}`}
      onClick={!disabled ? onClick : null}
      style={style}
      htmlType={htmlType}
    >
      {title}
    </Button>
  );
};

export default OvalButton;
