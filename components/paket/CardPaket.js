import { Col, Row, Card, Empty, Input, Form } from "antd";
import React, { useEffect, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

const { Meta } = Card;
import Helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
import general_helper from "../../helper/general_helper";

const CardPaket = ({ callback, loading, data, pagination }) => {
  const [form] = Form.useForm();
  const [font, setFont] = useState("14px");
  const [index, setIndex] = useState(0);
  const [state] = useAppState();

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
  }, [state]);

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
          onClick={(e) => callback(val)}
        >
          <Col md={6} xs={8} sm={8}>
            <img
              style={{ height: "110px", width: "100%", borderRadius: "10px" }}
              alt={val.gambar}
              src={val.gambar}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = general_helper.imgDefault;
              }}
            />
          </Col>
          <Col md={18} xs={16} sm={16}>
            <h5>{val.title}</h5>
            <p>{general_helper.toRp(val.price)}</p>
            {desc}
          </Col>
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
