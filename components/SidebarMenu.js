import {
  Badge,
  Divider,
  Drawer,
  Layout,
  Menu,
  Popconfirm,
  Row,
  Tooltip,
  Message,
  message,
} from "antd";
import { IdcardOutlined, PoweroffOutlined } from "@ant-design/icons";
import { capitalize, lowercase } from "../lib/helpers";
import { useEffect, useState } from "react";
import authAction, { doLogout } from "../action/auth.action";
import Router from "next/router";

import DashHeader from "./styles/Header";
import Inner from "./styles/Sidebar";
import Link from "next/link";
import Routes from "../lib/routes";
import { useAppState } from "./shared/AppProvider";
import { withRouter } from "next/router";
import general_helper from "../helper/general_helper";
import { StringLink } from "../helper/string_link_helper";
import { useSelector, useDispatch } from "react-redux";
import { getConfigAction } from "../redux/actions/info.action";
// import Router from "next/router";
import jwt_decode from "jwt-decode";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

let rootSubMenuKeys = [];
const versi = "Versi 1.0.7";
const getKey = (name, index) => {
  const string = `${name}-${index}`;
  let key = string.replace(" ", "-");
  return key.charAt(0).toLowerCase() + key.slice(1);
};

const SidebarContent = ({
  sidebarTheme,
  sidebarMode,
  sidebarIcons,
  collapsed,
  router,
}) => {
  const DISPATCH = useDispatch();

  const [state, dispatch] = useAppState();
  const [openKeys, setOpenKeys] = useState([]);
  const [user, setUser] = useState({});
  const [appRoutes] = useState(Routes);
  const { pathname } = router;
  const dataCart = useSelector((state) => state.paketReducer.dataCart);
  const dataConfig = useSelector((state) => state.infoReducer.dataConfig);
  const badgeTemplate = (badge) => (
    <Badge
      count={badge.value}
      className={`${state.direction === "rtl" ? "left" : "right"}`}
    />
  );

  useEffect(() => {
    appRoutes.forEach((route, index) => {
      const isCurrentPath = pathname.indexOf(lowercase(route.name)) > -1;
      const key = getKey(route.name, index);
      rootSubMenuKeys.push(key);
      if (isCurrentPath) setOpenKeys([...openKeys, key]);
    });
  }, [state, collapsed]);

  useEffect(() => {
    DISPATCH(getConfigAction());
  }, []);

  useEffect(() => {
    checkStockis();
  }, [state, collapsed]);

  const goLogout = () => {
    Router.push("/signin").then(() => authAction.doLogout());
  };

  const checkStockis = () => {
    checkJwt();
    if (dataConfig.stockis !== undefined) {
      if (dataConfig.stockis !== 1 && pathname === StringLink.deposit) {
        goLogout();
      }
      if (dataConfig.stockis !== 1 && pathname === StringLink.orderStockis) {
        goLogout();
      }
      if (dataConfig.stockis !== 0 && pathname === StringLink.stockis) {
        goLogout();
      }
    }
    if (dataConfig.activate !== undefined) {
      if (dataConfig.activate === 0 && pathname === StringLink.stockis) {
        goLogout();
      }
    }
    if (dataConfig.status_member !== undefined) {
      if (dataConfig.status_member === 2) {
        goLogout();
      }
    }
    // if (pathname === StringLink.tambahMitra) {
    //   goLogout();
    // }
  };

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.slice(-1);
    if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys([...latestOpenKey]);
    } else {
      setOpenKeys(latestOpenKey ? [...latestOpenKey] : []);
    }
  };

  const checkJwt = () => {
    const decodedToken = jwt_decode(atob(authAction.getToken()));
    const dateNow = new Date();
    console.log("#################");
    if (decodedToken.exp * 1000 < dateNow.getTime()) {
      message.info("sesi anda sudah habis").then(() => {
        message.info("silahkan login kembali").then(() => {
          goLogout();
        });
      });
    }
  };

  // const setEmomInterval = (expr, ...rest) =>
  //   setTimeout(
  //     () => (expr(...rest), setInterval(expr, 6000, ...rest)),
  //     6000 - (new Date().getTime() % (60 * 100))
  //   );

  // let jobs = setEmomInterval(() => checkJwt());
  // setTimeout(function () {
  //   clearInterval(jobs);
  // }, 60000);
  const menu = (
    <>
      <Menu
        theme={sidebarTheme}
        className="border-0 scroll-y sidebar"
        style={{
          flex: 1,
          height: "100%",
        }}
        mode={sidebarMode}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {appRoutes.map((route, index) => {
          checkStockis();
          const hasChildren = !!route.children;
          let displayNone = "block";
          let isStokis = dataConfig.stockis;
          let isActivate = dataConfig.activate;
          let rn = route.name;
          let strRegStokis = "Daftar Stokis";

          if (isStokis !== undefined && isActivate !== undefined) {
            if (isActivate === 0 && rn === strRegStokis) {
              displayNone = "none";
            }
            if (isStokis !== 0 && rn === strRegStokis) {
              displayNone = "none";
            }

            if (isStokis !== 1 && rn === "Stokis") {
              displayNone = "none";
            }
          }
          // if (route.name === "Register") {
          //   displayNone = "none";
          // }

          if (!hasChildren) {
            return (
              <Menu.Item
                style={{ display: displayNone }}
                key={getKey(route.name, index)}
                className={
                  pathname === route.path ? "ant-menu-item-selected" : ""
                }
                onClick={() => {
                  if (localStorage.linkBackProduct !== undefined) {
                    localStorage.removeItem("linkBackProduct");
                  }
                  setOpenKeys([getKey(route.name, index)]);
                  if (state.mobile) dispatch({ type: "mobileDrawer" });
                }}
                icon={sidebarIcons && route.icon}
              >
                <Link href={route.path}>
                  <a>
                    <span className="mr-auto">{capitalize(route.name)}</span>
                    {route.badge && badgeTemplate(route.badge)}
                  </a>
                </Link>
              </Menu.Item>
            );
          }

          if (hasChildren)
            return (
              <SubMenu
                style={{ display: displayNone }}
                key={getKey(route.name, index)}
                icon={sidebarIcons && route.icon}
                title={
                  <>
                    <span>{capitalize(route.name)}</span>
                    {route.badge && badgeTemplate(route.badge)}
                  </>
                }
              >
                {route.children.map((subitem, index) => {
                  let checkMenu;
                  if (isStokis !== undefined) {
                    if (subitem.name === "Daftar" && isStokis !== 0) {
                      checkMenu = (
                        <a
                          onClick={() =>
                            Message.info(
                              "halaman ini tidak bisa diakses oleh anda"
                            )
                          }
                        >
                          <span className="mr-auto">
                            {capitalize(subitem.name)}
                          </span>
                          {subitem.badge && badgeTemplate(subitem.badge)}
                        </a>
                      );
                    } else if (subitem.name === "Order" && isStokis !== 1) {
                      checkMenu = (
                        <a
                          onClick={() =>
                            Message.info(
                              "halaman ini tidak bisa diakses oleh anda"
                            )
                          }
                        >
                          <span className="mr-auto">
                            {capitalize(subitem.name)}
                          </span>
                          {subitem.badge && badgeTemplate(subitem.badge)}
                        </a>
                      );
                    } else {
                      checkMenu = (
                        <Link href={`${subitem.path ? subitem.path : ""}`}>
                          <a>
                            <span className="mr-auto">
                              {capitalize(subitem.name)}
                            </span>
                            {subitem.badge && badgeTemplate(subitem.badge)}
                          </a>
                        </Link>
                      );
                    }
                    return (
                      <Menu.Item
                        key={getKey(subitem.name, index)}
                        className={
                          pathname === subitem.path
                            ? "ant-menu-item-selected"
                            : ""
                        }
                        onClick={() => {
                          if (localStorage.linkBackProduct !== undefined) {
                            localStorage.removeItem("linkBackProduct");
                          }
                          if (state.mobile) dispatch({ type: "mobileDrawer" });
                        }}
                      >
                        {checkMenu}
                      </Menu.Item>
                    );
                  }
                })}
              </SubMenu>
            );
        })}
      </Menu>
    </>
  );
  return (
    <>
      <Inner>
        {!state.mobile && (
          <Sider
            width={220}
            className={`bg-${sidebarTheme}`}
            theme={sidebarTheme}
            collapsed={collapsed}
          >
            {menu}
            <Divider
              className={`m-0`}
              style={{
                display: `${sidebarTheme === "dark" ? "none" : ""}`,
              }}
            />
            <div className={`py-3 px-4 bg-${sidebarTheme}`}>
              <Row type="flex" align="middle" justify="space-around">
                <span>{versi}</span>
                <span className="mr-auto" />
                <a
                  onClick={() => {
                    Router.push(StringLink.profile);
                  }}
                  className={`px-3 ${
                    sidebarTheme === "dark" ? "text-white" : "text-body"
                  }`}
                >
                  <Tooltip title="Profile">
                    <IdcardOutlined style={{ fontSize: "20px" }} />
                  </Tooltip>
                </a>

                <Popconfirm
                  placement="top"
                  title="Anda yakin akan keluar ?"
                  onConfirm={() => {
                    doLogout();
                    Router.push("/signin");
                  }}
                  okText="Keluar"
                  cancelText="Batal"
                >
                  <a
                    style={{ cursor: "pointer" }}
                    className={`px-3 ${
                      sidebarTheme === "dark" ? "text-white" : "text-body"
                    }`}
                  >
                    <Tooltip title="keluar">
                      <PoweroffOutlined style={{ fontSize: "16px" }} />
                    </Tooltip>
                  </a>
                </Popconfirm>
              </Row>
            </div>
          </Sider>
        )}

        {state.mobile && (
          <Drawer
            closable={false}
            width={220}
            placement={`${state.direction === "rtl" ? "right" : "left"}`}
            onClose={() => dispatch({ type: "mobileDrawer" })}
            visible={state.mobileDrawer}
            className="chat-drawer"
          >
            <Inner>
              <div
                style={{
                  overflow: `hidden`,
                  flex: `1 1 auto`,
                  flexDirection: `column`,
                  display: `flex`,
                  height: `100vh`,
                  maxHeight: `-webkit-fill-available`,
                }}
              >
                <DashHeader>
                  <Header>
                    <img
                      src={general_helper.imgDefault}
                      style={{ width: "100px" }}
                    />
                  </Header>
                </DashHeader>
                {menu}
                <Divider
                  className={`m-0`}
                  style={{
                    display: `${sidebarTheme === "dark" ? "none" : ""}`,
                  }}
                />
                <div className={`py-3 px-4 bg-${sidebarTheme}`}>
                  <Row type="flex" align="middle" justify="space-around">
                    <span>{versi}</span>
                    <span className="mr-auto" />
                    <a
                      onClick={() => {
                        Router.push(StringLink.profile);
                        if (state.mobile) dispatch({ type: "mobileDrawer" });
                      }}
                      className={`px-3 ${
                        sidebarTheme === "dark" ? "text-white" : "text-body"
                      }`}
                    >
                      <Tooltip title="Profile">
                        <IdcardOutlined style={{ fontSize: "20px" }} />
                      </Tooltip>
                    </a>

                    <Popconfirm
                      placement="top"
                      title="Anda yakin akan keluar ?"
                      onConfirm={() => {
                        doLogout();
                        Router.push("/signin");
                      }}
                      okText="Keluar"
                      cancelText="Batal"
                    >
                      <a
                        style={{ cursor: "pointer" }}
                        className={`px-3 ${
                          sidebarTheme === "dark" ? "text-white" : "text-body"
                        }`}
                      >
                        <Tooltip title="keluar">
                          <PoweroffOutlined style={{ fontSize: "16px" }} />
                        </Tooltip>
                      </a>
                    </Popconfirm>
                  </Row>
                </div>
              </div>
            </Inner>
          </Drawer>
        )}
      </Inner>
    </>
  );
};

export default withRouter(SidebarContent);
