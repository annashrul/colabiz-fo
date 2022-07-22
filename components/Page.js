import { Container, Inner } from "./styles/Page";
import { Layout, Spin } from "antd";
import { useEffect, useState } from "react";
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/GlobalStyles";
import { useAppState } from "./shared/AppProvider";
import { withRouter } from "next/router";
import { StringLink } from "../helper/string_link_helper";
import Routes from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import authAction, { doLogout } from "../action/auth.action";
import { STRING_COOKIES } from "../redux/type";
const { Content } = Layout;

const NonDashboardRoutes = [
  "/signin",
  "/signup",
  "/lockscreen",
  "/_error",
  `/forgot-password/[kode-token]`,
  StringLink.transactionRecycle,
  StringLink.invoiceRecycle,
  StringLink.invoiceMitra,
  StringLink.invoiceProduct,
];

const Page = ({ router, children }) => {
  const [loading, setLoading] = useState(true);
  const [state] = useAppState();

  const isNotDashboard = NonDashboardRoutes.includes(router.pathname);
  console.log("is not dashboard", router.pathname);
  useEffect(() => {
    const coo = authAction.getToken();
    setTimeout(() => {
      if (!isNotDashboard) {
        if (coo !== undefined) {
          setLoading(false);
          // axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
          // const decodedToken = jwt_decode(atob(coo));
          // const dateNow = new Date();
          // if (decodedToken.exp * 1000 < dateNow.getTime()) {
          //   doLogout();
          // }
        } else {
          doLogout();
          Routes.push("/signin").then(() => setLoading(false));
        }
      } else {
        setLoading(false);
      }
    }, 1000);
  }, []);

  return (
    <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
      <ThemeProvider theme={theme}>
        <Container
          className={`${state.weakColor ? "weakColor" : ""} ${
            state.boxed ? "boxed shadow-sm" : ""
          }`}
        >
          {!isNotDashboard && <Header />}
          <Layout className="workspace">
            {!loading && !isNotDashboard && (
              <SidebarMenu
                sidebarTheme={state.darkSidebar ? "dark" : "light"}
                sidebarMode={state.sidebarPopup ? "vertical" : "inline"}
                sidebarIcons={state.sidebarIcons}
                collapsed={state.collapsed}
              />
            )}

            <Layout>
              {!loading && (
                <Content>
                  {!isNotDashboard ? <Inner>{children}</Inner> : children}
                </Content>
              )}
            </Layout>
          </Layout>
        </Container>
      </ThemeProvider>
    </Spin>
  );
};

export default withRouter(Page);
