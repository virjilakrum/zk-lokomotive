import "@/assets/style/header.less";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Select } from "antd";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAvatarImage } from "@/utils/defaultImage";
import { cache_user_key } from "@/features/auth/api/getLoginedUserInfo";
import { ConfrimModal } from "../Modal";
import { getUserInfo } from "@/features/auth/api/getLoginedUserInfo";
import { setIPFSNodeUrl } from "@/utils/ipfs";
import { repeatInterval } from "@/utils/repeatInterval";
import Emitter from "@/lib/emitter";
import { USERINFO_UPDATE } from "@/lib/emitter-events";
import useDarkMode from "use-dark-mode";
import {
  connect,
  setNetWorkChainId,
  getNetWorkChainId,
} from "@nulink_network/nulink-web-agent-access-sdk";

export enum NETWORK_LIST {
  Horus = "Horus", //testnet
  HorusMainNet = "Horus MainNet",
  ConfluxTestNet = "ConFlux Espace TestNet",
  PolygonTestNet = "Polygon Mumbai", //polygon testnet
  XChainTestNet = "OKX Chain TestNet",
}

const netWorkList: Array<any> = [
  {
    value: 97,
    key: NETWORK_LIST.Horus,
    label: "Horus (BSC Testnet)",
  },
  {
    value: 80001,
    key: NETWORK_LIST.PolygonTestNet,
    label: "Polygon Mumbai",
  },
  {
    value: 195,
    key: NETWORK_LIST.XChainTestNet,
    label: "X1 TestNet",
  },
];

export const Header = ({ setLoginUser, setLoginStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkMode = useDarkMode();

  const [avatar, setAvatar] = useState(defaultAvatarImage);
  const [activityKey, setActivityKey] = useState("1");
  const [user, setUser] = useState<any>();
  const [name, setName] = useState<any>("account1");
  const [chainID, setChainID] = useState<number>();
  const [selectNetworkConfig, setSelectNetworkConfig] = useState<any>();
  const [showConfirmTipModal, setShowConfirmTipModal] =
    useState<boolean>(false);

  const tabClick = (key) => {
    const path = key === "1" ? "/find" : key;
    navigate(path);
    setActivityKey(key);
  };
  const gotoConnect = async () => {
    await connect(async (data) => {
      window.location.reload();
    });
  };

  const _changeNetwork = async () => {
    if (selectNetworkConfig && selectNetworkConfig.key) {
      setShowConfirmTipModal(false);
      localStorage.setItem(
        "nulink_agent_react_chain_id",
        selectNetworkConfig.value,
      );
      window.location.reload()
      //await setNetWorkChainId(selectNetworkConfig.value);
      //window.location.reload();
    }
  };

  const _onOpenModal = (v: number, obj) => {
    setSelectNetworkConfig(obj);
    setShowConfirmTipModal(true);
  };

  const _onClose = () => {
    setShowConfirmTipModal(false);
  };

  const loginSuccessHandler = async (e) => {
    const date = e.data;
    const redirectUrl = date.redirectUrl;
    if (date && redirectUrl) {
      if (date.action == "login" && date.result == "success") {
        storage.setItem(cache_user_key, date);
        window.removeEventListener("message", loginSuccessHandler);
      }
    }
  };

  const fetchUserInfo = async () => {
    let user;
    try {
      user = await getUserInfo();
    } catch (error) {
      //1: login failed //2: login success
      setLoginStatus(1);
      console.error(error);
    }

    if (!!user) {
      setUser(user);
      setLoginUser(user);
      setIPFSNodeUrl(process.env.REACT_APP_IPFS_NODE_URL as string);
      setName(user.name);
      setLoginStatus(2);
    } else {
      setUser(null);
      setLoginUser(null);
      setLoginStatus(1);
    }

    return user;
  };

  const _logout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  const _fetchData = async () => {
    setChainID(await getNetWorkChainId());
    //setChainID(Number(localStorage.getItem("nulink_agent_react_chain_id")));
  };

  useEffect(() => {
    _fetchData();
    Emitter.on(USERINFO_UPDATE, async (userinfo) => {
      if (!userinfo) {
        return;
      }
      if (!!userinfo.avatar) {
        // update the avatar
        setAvatar(userinfo.avatar);
      }

      if (!!userinfo.name) {
        // update the nickname
        setName(userinfo.name);
      }

      //re fetch UserInfo
      await fetchUserInfo();
    });

    repeatInterval(async () => await fetchUserInfo(), {
      repeatNumber: 5,
    });

    return () => {
      Emitter.off(USERINFO_UPDATE, () => {});
    };
  }, []);

  return (
    <div className="header">
      {showConfirmTipModal && (
        <ConfrimModal
          title="Switching networks"
          content="Are you sure you want to switch the current network?"
          onConfirm={_changeNetwork}
          onClose={_onClose}
        />
      )}
      <div
        className="header_title"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <svg
          data-v-70b83f88=""
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 340.000000 250.000000"
          preserveAspectRatio="xMidYMid meet"
          colorInterpolationFilters="sRGB"
        >
          <rect
            data-v-70b83f88=""
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="#fff"
            fillOpacity="0"
          ></rect>{" "}
          <rect
            data-v-70b83f88=""
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#watermark)"
            fillOpacity="1"
          ></rect>{" "}
          <g
            data-v-70b83f88=""
            fill="#df9100"
            transform="translate(46.30000305175781,92.21383285522461)"
          >
            <g transform="matrix(1,0,0,1,0,0)" opacity="1">
              <g>
                <rect
                  fill="#333"
                  fillOpacity="0"
                  strokeWidth="2"
                  x="0"
                  y="0"
                  width="60"
                  height="65.57233721667286"
                ></rect>{" "}
                <svg
                  x="0"
                  y="0"
                  width="60"
                  height="65.57233721667286"
                  filterRes={"colorsb9734350211"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-0.000005335050900612259 0 46.28000259399414 50.57786560058594"
                  >
                    <path
                      d="M21.22 0v21.66a4.19 4.19 0 0 1-2.11 3.64L.36 36.12A8.52 8.52 0 0 1 0 33.66V16.72a8.48 8.48 0 0 1 1.13-4.23 8.59 8.59 0 0 1 3.11-3.11L18.9.91A8.75 8.75 0 0 1 21.22 0z"
                      fill="#2a3294"
                    ></path>
                    <path
                      d="M44 39.45A8.7 8.7 0 0 1 42 41l-14.62 8.46a8.6 8.6 0 0 1-8.48 0L4.24 41a8.42 8.42 0 0 1-1.95-1.56L21 28.63a4.17 4.17 0 0 1 4.21 0z"
                      fill="#ff006f"
                    ></path>
                    <path
                      d="M46.28 16.72v16.94a8.52 8.52 0 0 1-.37 2.46L27.16 25.3a4.23 4.23 0 0 1-2.1-3.65V0a8.89 8.89 0 0 1 2.32.91L42 9.38a8.52 8.52 0 0 1 4.24 7.34z"
                      fill="#0087ff"
                    ></path>
                  </svg>
                </svg>{" "}
              </g>
            </g>{" "}
            <g transform="translate(67.00000381469727,21.97116756439209)">
              <g
                data-gra="path-name"
                opacity="1"
                transform="matrix(1,0,0,1,0,0)"
              >
                <g transform="scale(1)">
                  <g>
                    <path
                      d="M0 0L4.19-19.7 17.25-19.7 16.76-17.35 10.39-17.35 9.18-11.67 14.49-11.67 13.99-9.28 8.69-9.28 6.7 0 0 0ZM23.95-13.34L21.07 0 14.77 0 17.59-13.34 23.95-13.34ZM24.76-17.41L24.76-17.41Q24.76-16.69 24.47-16.17 24.17-15.64 23.69-15.27 23.21-14.89 22.59-14.71 21.97-14.52 21.32-14.52L21.32-14.52Q20.08-14.52 19.24-15.11 18.4-15.7 18.4-16.97L18.4-16.97Q18.4-17.66 18.68-18.2 18.96-18.74 19.44-19.1 19.92-19.46 20.56-19.64 21.19-19.83 21.88-19.83L21.88-19.83Q23.09-19.83 23.92-19.24 24.76-18.65 24.76-17.41ZM34.63-20.85L30.19 0 23.86 0 28.27-20.85 34.63-20.85ZM48.75-6.24L40.03-6.24Q39.9-5.55 39.86-4.93 39.81-4.31 39.81-3.82L39.81-3.82Q39.81-3.54 39.84-3.2 39.87-2.85 39.98-2.56 40.09-2.27 40.29-2.06 40.49-1.86 40.87-1.86L40.87-1.86Q41.14-1.86 41.5-2.05 41.86-2.23 42.22-2.58 42.57-2.92 42.9-3.41 43.22-3.91 43.41-4.53L43.41-4.53 48.5-4.53 47.69-1.21Q47.07-0.81 46.26-0.53 45.46-0.25 44.56-0.08 43.66 0.09 42.73 0.17 41.8 0.25 40.96 0.25L40.96 0.25Q39.41 0.25 38.07-0.03 36.74-0.31 35.75-0.99 34.75-1.68 34.18-2.81 33.6-3.94 33.6-5.62L33.6-5.62Q33.6-7.14 34.09-8.6 34.57-10.05 35.7-11.19 36.83-12.32 38.74-13 40.65-13.68 43.5-13.68L43.5-13.68Q46.61-13.68 48.17-12.72 49.74-11.76 49.74-9.71L49.74-9.71Q49.74-8.87 49.49-7.9 49.24-6.92 48.75-6.24L48.75-6.24ZM44.15-9.93L44.15-9.93Q44.15-10.89 43.84-11.23 43.53-11.57 43.1-11.57L43.1-11.57Q42.6-11.57 42.18-11.25 41.77-10.92 41.42-10.38 41.08-9.84 40.8-9.14 40.52-8.44 40.34-7.66L40.34-7.66 43.88-7.66Q43.94-8.04 44-8.44L44-8.44Q44.06-8.78 44.11-9.18 44.15-9.59 44.15-9.93ZM74.81-19.7L74.28-17.35 69.29-17.35 65.6 0 58.89 0 62.59-17.35 57.65-17.35 58.21-19.7 74.81-19.7ZM70.28 0L73.1-13.34 78.16-13.34 78.63-11.02 78.85-11.02Q79.56-12.13 80.68-12.91 81.79-13.68 83.62-13.68L83.62-13.68Q83.75-13.68 84.01-13.67 84.28-13.65 84.6-13.58 84.93-13.5 85.28-13.36 85.64-13.22 85.98-12.97L85.98-12.97 84.62-6.58 81.23-6.58Q81.17-8.5 80.89-9.26 80.61-10.02 79.99-10.02L79.99-10.02Q79.68-10.02 79.33-9.88 78.97-9.74 78.6-9.28L78.6-9.28 76.61 0 70.28 0ZM87.22-9.43L87.81-12.19Q89.39-12.97 91.05-13.33 92.72-13.68 94.76-13.68L94.76-13.68Q96.75-13.68 98.05-13.37 99.36-13.06 100.13-12.47 100.91-11.88 101.22-11.08 101.53-10.27 101.53-9.25L101.53-9.25Q101.53-8.66 101.45-7.97 101.37-7.29 101.28-6.83L101.28-6.83 99.82 0 94.83 0 94.27-1.99 94.08-1.99Q93.09-0.9 91.77-0.33 90.45 0.25 89.15 0.25L89.15 0.25Q88.4 0.25 87.69 0.03 86.97-0.19 86.42-0.64 85.86-1.09 85.52-1.78 85.17-2.48 85.17-3.48L85.17-3.48Q85.17-5.09 86.06-6.04 86.94-6.98 88.39-7.46 89.83-7.94 91.64-8.07 93.46-8.19 95.29-8.19L95.29-8.19Q95.35-8.5 95.45-9.08 95.54-9.65 95.54-10.08L95.54-10.08Q95.54-10.64 95.24-11.12 94.95-11.6 94.02-11.6L94.02-11.6Q92.93-11.6 92.42-10.97 91.91-10.33 91.75-9.43L91.75-9.43 87.22-9.43ZM94.45-4.34L94.95-6.73 94.39-6.73Q93.49-6.73 92.85-6.5 92.22-6.27 91.83-5.9 91.44-5.52 91.26-5.06 91.07-4.59 91.07-4.13L91.07-4.13Q91.07-3.38 91.46-3.01 91.85-2.64 92.37-2.64L92.37-2.64Q93.03-2.64 93.66-3.1 94.3-3.57 94.45-4.34L94.45-4.34ZM110.84-11.36L111.02-11.36Q111.67-11.98 112.48-12.5L112.48-12.5Q113.19-12.94 114.16-13.31 115.12-13.68 116.3-13.68L116.3-13.68Q117.91-13.68 118.97-12.86 120.02-12.04 120.02-10.61L120.02-10.61Q120.02-10.21 119.93-9.63 119.83-9.06 119.71-8.44 119.59-7.82 119.45-7.18 119.31-6.55 119.21-6.05L119.21-6.05 117.91 0 111.61 0 113.32-8.1Q113.38-8.5 113.47-8.92 113.57-9.34 113.57-9.68L113.57-9.68Q113.57-10.15 113.33-10.44 113.1-10.74 112.64-10.74L112.64-10.74Q112.08-10.74 111.57-10.33 111.05-9.93 110.77-9.65L110.77-9.65 108.73 0 102.4 0 105.22-13.34 110.28-13.34 110.84-11.36ZM134.45-9.43L130.42-9.43Q130.45-9.59 130.48-9.74 130.51-9.9 130.51-10.08L130.51-10.08Q130.51-10.64 130.31-11.12 130.11-11.6 129.52-11.6L129.52-11.6Q128.99-11.6 128.46-11.15 127.93-10.71 127.93-9.96L127.93-9.96Q127.93-9.46 128.2-9.17 128.46-8.87 128.9-8.69 129.33-8.5 129.87-8.38 130.42-8.25 130.94-8.13L130.94-8.13Q131.69-7.94 132.35-7.68 133.02-7.42 133.55-6.98 134.08-6.55 134.39-5.91 134.7-5.27 134.7-4.34L134.7-4.34Q134.7-3.04 134.09-2.16 133.49-1.27 132.42-0.73 131.35-0.19 129.9 0.03 128.46 0.25 126.82 0.25L126.82 0.25Q124.3 0.25 122.66-0.12 121.01-0.5 120.36-0.84L120.36-0.84 121.01-3.94 125.2-3.94Q125.17-3.79 125.17-3.65 125.17-3.51 125.17-3.35L125.17-3.35Q125.17-2.64 125.5-2.22 125.82-1.8 126.63-1.8L126.63-1.8Q127.53-1.8 127.92-2.31 128.31-2.82 128.31-3.26L128.31-3.26Q128.31-3.69 127.98-4.02 127.65-4.34 127.16-4.58 126.66-4.81 126.06-4.98 125.45-5.15 124.89-5.31L124.89-5.31Q124.49-5.4 123.98-5.62 123.46-5.83 123-6.24 122.53-6.64 122.22-7.28 121.91-7.91 121.91-8.87L121.91-8.87Q121.91-10.24 122.58-11.15 123.25-12.07 124.32-12.63 125.39-13.19 126.74-13.44 128.09-13.68 129.45-13.68L129.45-13.68Q131.16-13.68 132.68-13.37 134.2-13.06 135.16-12.57L135.16-12.57 134.45-9.43ZM136.78-11.26L137.24-13.34 139.63-13.34 139.91-14.61Q140.31-16.48 141.09-17.76 141.87-19.05 142.94-19.86 144.01-20.67 145.37-21.02 146.74-21.38 148.29-21.38L148.29-21.38Q149.25-21.38 150.34-21.25 151.42-21.13 152.6-20.85L152.6-20.85 152.1-18.37Q151.42-18.46 150.65-18.51 149.87-18.56 149.41-18.56L149.41-18.56Q148.78-18.56 148.33-18.46 147.88-18.37 147.54-18.11 147.2-17.84 146.95-17.38 146.71-16.91 146.55-16.14L146.55-16.14 145.96-13.34 149.22-13.34 148.82-11.26 145.53-11.26 143.14 0 136.81 0 139.2-11.26 136.78-11.26ZM163.52-6.24L154.8-6.24Q154.68-5.55 154.63-4.93 154.59-4.31 154.59-3.82L154.59-3.82Q154.59-3.54 154.62-3.2 154.65-2.85 154.76-2.56 154.87-2.27 155.07-2.06 155.27-1.86 155.64-1.86L155.64-1.86Q155.92-1.86 156.28-2.05 156.64-2.23 156.99-2.58 157.35-2.92 157.67-3.41 158-3.91 158.19-4.53L158.19-4.53 163.28-4.53 162.47-1.21Q161.85-0.81 161.04-0.53 160.23-0.25 159.33-0.08 158.43 0.09 157.5 0.17 156.57 0.25 155.74 0.25L155.74 0.25Q154.18 0.25 152.85-0.03 151.52-0.31 150.52-0.99 149.53-1.68 148.96-2.81 148.38-3.94 148.38-5.62L148.38-5.62Q148.38-7.14 148.86-8.6 149.34-10.05 150.48-11.19 151.61-12.32 153.52-13 155.42-13.68 158.28-13.68L158.28-13.68Q161.38-13.68 162.95-12.72 164.52-11.76 164.52-9.71L164.52-9.71Q164.52-8.87 164.27-7.9 164.02-6.92 163.52-6.24L163.52-6.24ZM158.93-9.93L158.93-9.93Q158.93-10.89 158.62-11.23 158.31-11.57 157.88-11.57L157.88-11.57Q157.38-11.57 156.96-11.25 156.54-10.92 156.2-10.38 155.86-9.84 155.58-9.14 155.3-8.44 155.11-7.66L155.11-7.66 158.65-7.66Q158.71-8.04 158.78-8.44L158.78-8.44Q158.84-8.78 158.88-9.18 158.93-9.59 158.93-9.93ZM164.7 0L167.53-13.34 172.58-13.34 173.05-11.02 173.27-11.02Q173.98-12.13 175.1-12.91 176.21-13.68 178.05-13.68L178.05-13.68Q178.17-13.68 178.43-13.67 178.7-13.65 179.02-13.58 179.35-13.5 179.71-13.36 180.06-13.22 180.4-12.97L180.4-12.97 179.04-6.58 175.66-6.58Q175.59-8.5 175.31-9.26 175.04-10.02 174.41-10.02L174.41-10.02Q174.1-10.02 173.75-9.88 173.39-9.74 173.02-9.28L173.02-9.28 171.03 0 164.7 0Z"
                      transform="translate(0, 21.3799991607666)"
                    ></path>
                  </g>{" "}
                </g>
              </g>{" "}
            </g>
          </g>
          <defs v-gra="od"></defs>
        </svg>
      </div>
      <div className="header_tab">
        {/*{chainID ? (
          <Select
            value={chainID}
            style={{ width: 240 }}
            options={netWorkList}
            onChange={_onOpenModal}
          />
        ) : null }*/}
        <div
          className={activityKey === "1" ? "activity" : ""}
          onClick={() => tabClick("1")}
        >
          {t<string>("header-a-tab-1")}
          <div className="line"></div>
        </div>
        <div className="toggle-theme mar-lr-8" onClick={darkMode.toggle} />
        {user ? (
          <>
            <div
              className="user_box flex_row"
              onClick={() => {
                navigate("/memberCenter");
              }}
            >
              {name}
              <div className="user_img">
                <div
                  className="user_img_item"
                  style={{ background: `url(${avatar})` }}
                />
              </div>
            </div>
            <div className="tab_btn log_out_btn" onClick={_logout}>
              Logout
            </div>
          </>
        ) : (
          <div className="tab_btn" onClick={gotoConnect}>
            {t<string>("header-a-btn-2")}
          </div>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  setLoginUser: PropTypes.func.isRequired,
};
