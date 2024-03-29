import { Col, Button, Card, Row, Empty, Spin } from "antd";
import { AlignCenterOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCartAction, postCart } from "../../redux/actions/cart.action";
import { getPaket } from "../../redux/actions/paket.action";
import { useAppState } from "../shared/AppProvider";
import { getConfigAction } from "../../redux/actions/info.action";
import FormComponent from "../profile/formComponent";
import authAction from "../../action/auth.action";
import Router from "next/router";
import general_helper from "../../helper/general_helper";

const CardProduct = ({ category = "REGISTER" }) => {
  const dispatch = useDispatch();
  const [font, setFont] = useState("14px");
  const [isModalPin, setIsModalPin] = useState(false);
  const [state] = useAppState();
  const { dataConfig } = useSelector((state) => state.infoReducer);
  const { loadingRegister, dataRegister } = useSelector(
    (state) => state.paketReducer
  );
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
  }, [state]);

  useEffect(() => {
    dispatch(getCartAction());
    dispatch(getConfigAction());
    dispatch(getPaket("page=1", category));
  }, []);

  return (
    <>
      <Spin spinning={loadingRegister}>
        <Row gutter={4}>
          {dataRegister.length > 0 ? (
            dataRegister.map((val, key) => {
              let desc = general_helper.rmHtml(val.caption);
              let lengthIsMobile = state.mobile ? 50 : 80;
              if (desc.length > lengthIsMobile) {
                desc = desc.substr(0, lengthIsMobile) + " ..";
              }

              return (
                <Col
                  key={key}
                  xs={12}
                  sm={8}
                  md={5}
                  className="mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {}}
                >
                  <Card
                    title={
                      <small
                        style={{
                          fontSize: font,
                        }}
                      >
                        {val.title}
                      </small>
                    }
                    hoverable
                    cover={
                      <img
                        //   style={{ height: !state.mobile ? "180px" : "130px" }}
                        alt="example"
                        src={val.gambar}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = Helper.imgDefault;
                        }}
                      />
                    }
                  >
                    <small style={{ fontSize: font }}>
                      {general_helper.toRp(val.price)}
                    </small>
                    <br />
                    <small style={{ fontSize: font }}>{desc}</small>
                    <Row gutter={4}>
                      <Col xs={24} md={12} sm={12}>
                        <Button
                          danger
                          onClick={(e) => {
                            localStorage.setItem("linkBackProduct", 3);
                            Router.push(`/pembelian/${val.id}`);
                          }}
                          size="small"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          <AlignCenterOutlined /> Detail
                        </Button>
                      </Col>
                      <Col xs={24} md={12} sm={12}>
                        <Button
                          onClick={(e) => {
                            if (dataConfig.pin === "-") {
                              setIsModalPin(true);
                            } else {
                              dispatch(postCart(val.id));
                            }
                          }}
                          size="small"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          <ShoppingCartOutlined /> Tambah
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col xs={24} sm={24} md={24}>
              <Empty />
            </Col>
          )}
        </Row>
      </Spin>
      {isModalPin && (
        <FormComponent
          isModal={isModalPin}
          ok={(e) => {
            setIsModalPin(false);
          }}
          cancel={(e) => setIsModalPin(false)}
          userData={authAction.getUser()}
          isCreate={true}
        />
      )}
    </>
  );
};

export default CardProduct;
