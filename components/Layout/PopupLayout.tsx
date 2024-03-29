import * as React from "react";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";
import { Head } from "../Head";
import { useNavigate } from "react-router-dom";

type PopupLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const PopupLayout = ({ children, title }: PopupLayoutProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Head title={title} />
      <div>
        {/* Not suit for `ConnectPopup.tsx`, it have to change its style cause padt and padb changed */}
        <h2 className="relative padb-22">
          <ArrowLeftOutlined className="absolute left-0" onClick={()=>navigate(-1)}/>
          <span>{title}</span>
        </h2>
        <div>{children}</div>
      </div>
    </>
  );
};
