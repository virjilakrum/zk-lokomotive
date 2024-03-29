import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";
type OnConfirm = () => void;
type OnCancel = () => void;
type OnChange = (visible: boolean) => void;
type usePopupProps = {
  visible: boolean;
  title?: string;
  content: string;
  onConfirm?: OnConfirm;
  onCancel?: OnCancel;
  onChange: OnChange;
}
export const UsePopup = ({ visible, title, content, onChange, onConfirm, onCancel }: usePopupProps) => {
  const { t } = useTranslation();
  const btnStyle = {
    width: "150px",
    height: "48px",
    background: "#FFFFFF",
    borderRadius: "4px",
    border: "1px solid #797C84",
    padding: "0",
    fontSize: "16px",
    fontWeight: "600"
  };
  const btnStyleOk = {
    background: "#27B7B7",
    color: "#fff",
    marginLeft: "20px",
    borderColor: "#27B7B7"
  };
  const confirmHander = () => {
    onConfirm && onConfirm();
    onChange(false);
  };
  const cancelHander = () => {
    onCancel && onCancel();
    onChange(false);
  };

  return <>
    <Modal title={title || t("member-center-modal-title-text")} width="640px" visible={visible} centered footer={null}
      maskClosable={false} className="modal_class" onCancel={cancelHander}>
      <div>{content}</div>
      <div className="modal_btn">
        <Button style={Object.assign({}, btnStyle, btnStyleOk)} onClick={confirmHander}>{t<string>("member-center-modal-confirm-btn")}</Button>
      </div>
    </Modal>
  </>
}