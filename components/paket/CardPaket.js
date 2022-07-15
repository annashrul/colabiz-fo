import { Typography, Col, Row, Empty, Button, Tooltip, Divider } from "antd";
import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";

import Helper from "../../helper/general_helper";
import general_helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
const { Paragraph, Text } = Typography;

const CardPaket = ({ isButton = false, callback, data, pagination }) => {
  const [state] = useAppState();

  return data !== undefined && data.length > 0 ? (
    data.map((val, key) => {
      let desc = Helper.rmHtml(val.caption);
      let lengthIsMobile = state.mobile ? 50 : 80;
      if (desc.length > lengthIsMobile) {
        desc = desc.substr(0, lengthIsMobile) + " ..";
      }
      return (
        <Row
          key={key}
          gutter={16}
          className={data.length > 1 ? "mb-2" : ""}
          style={{ cursor: "pointer" }}
        >
          <Col md={6} xs={8} sm={8}>
            <img
              style={{ height: "100px", width: "100%", borderRadius: "10px" }}
              alt={val.gambar}
              src={val.gambar}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = general_helper.imgDefault;
              }}
            />
          </Col>
          <Col md={18} xs={16} sm={16}>
            {!state.mobile && (
              <Row justify="space-beetwen">
                <Col md={!isButton ? 24 : 18}>
                  <h5>{val.title}</h5>
                </Col>
                {isButton && (
                  <Col md={6}>
                    <Button
                      onClick={(e) => {
                        callback(val);
                      }}
                      className="text-right"
                      style={{ float: "right" }}
                    >
                      <ShoppingCartOutlined /> Tambah
                    </Button>
                  </Col>
                )}
              </Row>
            )}
            {state.mobile && <h5>{val.title}</h5>}
            <p>{general_helper.toRp(val.price)}</p>
            <Tooltip title={Helper.rmHtml(val.caption)}>{desc}</Tooltip>
          </Col>
          {state.mobile && isButton && (
            <Col xs={24}>
              <Button
                onClick={(e) => {
                  callback(val);
                }}
                style={{ width: "100%", marginTop: "10px" }}
              >
                <ShoppingCartOutlined /> Tambah
              </Button>
            </Col>
          )}
          <Divider style={{ padding: "0px" }} />
        </Row>
      );
    })
  ) : (
    <Col xs={24} sm={24} md={24}>
      <Empty />
    </Col>
  );
};

export default CardPaket;
