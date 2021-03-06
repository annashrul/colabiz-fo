import { Layout, Menu, Badge, Alert, message } from "antd";
import DashHeader from "./styles/Header";
import { useAppState } from "./shared/AppProvider";
import general_helper from "../helper/general_helper";
import React, { useEffect, useState } from "react";
import { StringLink } from "../helper/string_link_helper";
import authAction from "../action/auth.action";
import Router from "next/router";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCartAction } from "../redux/actions/cart.action";
import Marquee from "react-fast-marquee";

const { Header } = Layout;

const MainHeader = () => {
  const [user, setUser] = useState({});
  const { data } = useSelector((state) => state.cartReducer);
  const [state, dispatch] = useAppState();

  useEffect(() => {
    const users = authAction.getUser();
    if (users === undefined) {
      Router.push("/signin");
      authAction.doLogout();
    } else {
      setUser(users);
    }
  }, []);

  return (
    <>
      <DashHeader>
        <Header>
          <Menu mode="horizontal">
            {state.mobile && (
              <Menu.Item>
                <a
                  onClick={() => dispatch({ type: "mobileDrawer" })}
                  className="trigger"
                >
                  <svg
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 384.97 384.97"
                    style={{ enableBackground: "new 0 0 384.97 384.97" }}
                    xmlSpace="preserve"
                  >
                    <g id="Menu_1_">
                      <path
                        d="M12.03,120.303h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
                      c-6.641,0-12.03,5.39-12.03,12.03C0,114.913,5.39,120.303,12.03,120.303z"
                      />
                      <path
                        d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
                      S379.58,180.455,372.939,180.455z"
                      />
                      <path
                        d="M372.939,264.667H132.333c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h240.606
                      c6.641,0,12.03-5.39,12.03-12.03C384.97,270.056,379.58,264.667,372.939,264.667z"
                      />
                    </g>
                  </svg>
                </a>
              </Menu.Item>
            )}
            {!state.mobile && (
              <Menu.Item>
                <img
                  src={general_helper.imgDefault}
                  style={{ width: "100px" }}
                />
              </Menu.Item>
            )}

            <span className="mr-auto" />
            {user.stockis === 1 && (
              <Alert
                banner
                message={
                  <Marquee pauseOnHover gradient={false}>
                    &nbsp; Saat ini status anda adalah stokis.
                  </Marquee>
                }
              />
            )}

            <Menu.Item
              onClick={() => {
                if (data.length > 0) {
                  if (localStorage.getItem("dataStokis") === null) {
                    message.info("silahkan pilih stokis terlebih dahulu");
                  } else {
                    Router.push(StringLink.checkout);
                  }
                }
              }}
            >
              <Badge count={data && data.length}>
                <ShoppingCartOutlined
                  style={{
                    fontSize: 20,
                  }}
                />
              </Badge>
            </Menu.Item>
          </Menu>
        </Header>
      </DashHeader>
    </>
  );
};

export default MainHeader;
