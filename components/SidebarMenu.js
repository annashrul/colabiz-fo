import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Layout,
  List,
  Menu,
  Popconfirm,
  Row,
  Switch,
  Tooltip,
  Message,
} from "antd";
import {
  FolderTwoTone,
  IdcardOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
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

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

let rootSubMenuKeys = [];

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
  const [state, dispatch] = useAppState();
  const [openKeys, setOpenKeys] = useState([]);
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({});
  const [isStockis, setIsStockis] = useState(true);
  const [appRoutes] = useState(Routes);
  const { pathname } = router;

  const badgeTemplate = (badge) => (
    <Badge
      count={badge.value}
      className={`${state.direction === "rtl" ? "left" : "right"}`}
    />
  );

  useEffect(() => {
    let users = authAction.getUser();
    let infos = authAction.getInfo();
    // setInfo(infos);
    setUser(users);
    appRoutes.forEach((route, index) => {
      const isCurrentPath = pathname.indexOf(lowercase(route.name)) > -1;
      const key = getKey(route.name, index);
      rootSubMenuKeys.push(key);
      if (isCurrentPath) setOpenKeys([...openKeys, key]);
    });
    // setTimeout(() => checkStatusMember(), 300);
  }, [state, collapsed]);

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.slice(-1);
    if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys([...latestOpenKey]);
    } else {
      setOpenKeys(latestOpenKey ? [...latestOpenKey] : []);
    }
  };

  const checkStatusMember = () => {
    if (info !== undefined) {
      if (pathname === StringLink.stockis && user.stockis === 0) {
        setIsStockis(false);
      }
      // if (user.stockis === 0) {
      //   Message.info("Anda belum dapat mengakses menu ini");
      //   return;
      // }
      // if (info.status_member === 3) {
      //   Message.info("Anda Telah Mencapai Limit Bonus")
      //     .then(() =>
      //       Message.info("Silahkan Login Kembali Untuk Melakukan Recycle")
      //     )
      //     .then(() => {
      //       Router.push("/signin");
      //       doLogout();
      //     });
      // }
    }
  };

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
          // console.log(route);
          // console.log(Object.keys(user));
          if (Object.keys(user).length > 0) {
            if (route.name === "Stokis") {
              if (user.stockis === 1) {
                delete appRoutes[index];
              }
            }
          }

          const hasChildren = !!route.children;
          if (!hasChildren) {
            return (
              <Menu.Item
                key={getKey(route.name, index)}
                className={
                  pathname === route.path ? "ant-menu-item-selected" : ""
                }
                onClick={() => {
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
                  return (
                    <Menu.Item
                      key={getKey(subitem.name, index)}
                      className={
                        pathname === subitem.path
                          ? "ant-menu-item-selected"
                          : ""
                      }
                      onClick={() => {
                        if (state.mobile) dispatch({ type: "mobileDrawer" });
                      }}
                    >
                      <Link href={`${subitem.path ? subitem.path : ""}`}>
                        <a>
                          <span className="mr-auto">
                            {capitalize(subitem.name)}
                          </span>
                          {subitem.badge && badgeTemplate(subitem.badge)}
                        </a>
                      </Link>
                    </Menu.Item>
                  );
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
                <span>
                  <Avatar shape="circle" size={40} src={user.foto}>
                    {user.fullname &&
                      general_helper.getInitialName(user.fullname)}
                  </Avatar>
                </span>
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
                    <span>
                      <Avatar shape="circle" size={40} src={user.foto}>
                        {user.fullname &&
                          general_helper.getInitialName(user.fullname)}
                      </Avatar>
                    </span>
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
