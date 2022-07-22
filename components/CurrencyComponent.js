import { Button, Form, Row, Col, Divider, Select, Input, Card } from "antd";
import React, { useRef, useEffect, useState } from "react";
import general_helper from "../helper/general_helper";

const CurrencyComponent = ({ callback, val }) => {
  const [isActiveAmount, setIsActiveAmount] = useState("");
  const caraCepat = [
    "100000",
    "200000",
    "300000",
    "400000",
    "500000",
    "1000000",
  ];

  useEffect(() => {
    for (let i = 0; i < caraCepat.length; i++) {
      if (parseInt(val, 10) === parseInt(caraCepat[i], 10)) {
        setIsActiveAmount(i);
        break;
      } else {
        setIsActiveAmount("");
        continue;
      }
    }
  }, [val]);

  return (
    <Row gutter={4}>
      {caraCepat.map((res, key) => {
        return (
          <Col md={8} sm={8} xs={8} key={key} className="mb-2">
            <Button
              style={{ width: "100%" }}
              shape="round"
              type={isActiveAmount === key ? `danger` : `dashed`}
              key={key}
              onClick={(e) => {
                setIsActiveAmount(key);
                callback(res);
              }}
            >
              <small>{general_helper.toRp(res)}</small>
            </Button>
          </Col>
        );
      })}
    </Row>
  );
};

export default CurrencyComponent;
