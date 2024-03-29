import { Layout } from "antd";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MyRoutes } from "@/routes";
import { BrowserRouter, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { Login } from "./Login";

type ProviderProps = {
  children: React.ReactNode;
};
const layoutStyle = {
  background: "transparent",
};
export const MainLayout = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<any>();
  const [loginStatus, setLoginStatus] = useState<any>(0); // 0: logining //1: login failed //2: login success: : when user login succeed, the Login page is hidden

  return (
    <>
      <Layout style={layoutStyle}>
        <BrowserRouter>
          <Header setLoginUser={setUser} setLoginStatus={setLoginStatus} />
          {!!user ? (
            <div>
              <MyRoutes />
              <Outlet />
            </div>
          ) : (
            <Login loginStatus={loginStatus} />
          )}

          {/* <Footer /> */}
        </BrowserRouter>
      </Layout>
    </>
  );
};
