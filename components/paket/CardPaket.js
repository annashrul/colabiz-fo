import { Col, Row, Card, Empty, Input, Form, Button } from "antd";
import React, { useEffect, useState } from "react";
import { CheckOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Meta } = Card;
import Helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
import general_helper from "../../helper/general_helper";
import { useDispatch, useSelector } from "react-redux";
import { cartAction, getCartAction } from "../../redux/actions/paket.action";

const CardPaket = ({ callback, loading, data, pagination }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [font, setFont] = useState("14px");
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(0);
  const [state] = useAppState();
  const { dataCart } = useSelector((state) => state.paketReducer);
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    dispatch(getCartAction());
  }, [state]);

  return data !== undefined && data.length > 0 ? (
    data.map((val, key) => {
      let desc = Helper.rmHtml(val.caption);
      let lengthIsMobile = state.mobile ? 50 : 80;
      if (desc.length > lengthIsMobile) {
        desc = desc.substr(0, lengthIsMobile) + " ..";
      }
      // Object.assign(val, { qty: 0 });
      return (
        <Row
          key={key}
          gutter={16}
          className={data.length > 1 ? "mb-2" : ""}
          style={{ cursor: "pointer" }}
          // onClick={(e) => callback(val)}
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
            {!state.mobile && (
              <Row justify="space-beetwen">
                <Col md={18}>
                  <h5>{val.title}</h5>
                </Col>
                <Col md={6}>
                  <Button
                    onClick={(e) => {
                      let quantity = qty;
                      quantity += 1;
                      Object.assign(val, { qty: quantity });
                      setQty(quantity);
                      callback(val);
                    }}
                    className="text-right"
                    style={{ float: "right" }}
                  >
                    <ShoppingCartOutlined /> Tambah
                  </Button>
                </Col>
              </Row>
            )}
            {state.mobile && <h5>{val.title}</h5>}
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
