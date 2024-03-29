import { useNavigate } from "react-router-dom";
import "@/assets/style/notice.less";
import { getUnreadTotal } from "./api/notice";
import { useEffect, useState } from "react";

const Notice = () => {
  const navigate = useNavigate();
  const [unreadTotal, setUnreadTotal] = useState<number>(0);

  return (
    <div
      onClick={() => {
        navigate("/notice");
      }}
      className="notice-icon-a"
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.0001 36.6666C18.1602 36.6576 16.6683 35.1732 16.6501 33.3333H23.3167C23.3203 33.7789 23.2353 34.2208 23.0667 34.6333C22.6295 35.6366 21.7364 36.3685 20.6667 36.6H20.6584H20.6334H20.6034H20.5884C20.3948 36.6403 20.1978 36.6626 20.0001 36.6666ZM33.3334 31.6666H6.66675V28.3333L10.0001 26.6666V17.5C9.91228 15.1485 10.4433 12.8152 11.5401 10.7333C12.6318 8.8025 14.4979 7.43144 16.6667 6.96665V3.33331H23.3334V6.96665C27.6317 7.98998 30.0001 11.73 30.0001 17.5V26.6666L33.3334 28.3333V31.6666Z"
          fill="url(#paint0_linear_4289_766)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4289_766"
            x1="-4.91476"
            y1="20"
            x2="33.5122"
            y2="19.2326"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEA7D" />
            <stop offset="0.527145" stopColor="#F19090" />
            <stop offset="1" stopColor="#ba9756" />
          </linearGradient>
        </defs>
      </svg>
      {unreadTotal > 0 && <span className="unread-count">{unreadTotal}</span>}
    </div>
  );
};

export default Notice;
