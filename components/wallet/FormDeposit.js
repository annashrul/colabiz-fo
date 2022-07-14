import { Button, Form, Row, Col, Select, Input, Card, Spin } from "antd";

import React, { useRef, useEffect, useState } from "react";
import ModalPin from "../ModalPin";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import authAction from "../../action/auth.action";
import general_helper from "../../helper/general_helper";
import { depositAction } from "../../redux/actions/wallet.action";
import { paymentChannelAction } from "../../redux/actions/paymentChannel.action";
const { Option } = Select;

const FormDeposit = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [modalPin, setModalPin] = useState(false);
  const [isActiveAmount, setIsActiveAmount] = useState("");
  const [user, setUser] = useState({});
  const [dataDeposit, setDataDeposit] = useState({});
  const [nominalError, setNominalError] = useState({
    enable: false,
    helpText: "-",
  });
  const nominalErrorRef = useRef(nominalError);
  const nominalInput = useRef(null);

  const { loadingDeposit } = useSelector((state) => state.walletReducer);
  const { data, loading } = useSelector((state) => state.paymentChannelReducer);
  useEffect(() => {
    nominalErrorRef.current = nominalError;
    if (nominalError.enable) {
      nominalInput.current.focus();
      form.validateFields();
    }
  }, [nominalError]);
  useEffect(() => {
    dispatch(paymentChannelAction());
    setUser(authAction.getUser());
  }, []);

  const onChange = (e) => {
    let val = e.target.value;
    for (let i = 0; i < caraCepat.length; i++) {
      if (parseInt(val, 10) === parseInt(caraCepat[i], 10)) {
        setIsActiveAmount(i);
        break;
      } else {
        setIsActiveAmount("");
        continue;
      }
    }
  };

  const handleFinish = (pin) => {
    Object.assign(dataDeposit, {
      member_pin: pin,
    });
    dispatch(depositAction(dataDeposit));
  };

  const handleSubmit = async (e) => {
    setModalPin(true);
    setDataDeposit(e);
  };

  const caraCepat = [
    "100000",
    "200000",
    "300000",
    "400000",
    "500000",
    "1000000",
  ];
  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        name="withdraw"
        onFinish={handleSubmit}
        onChange={() => {
          if (nominalError.enable) {
            setNominalError({ enable: false, helpText: "" });
          }
        }}
      >
        <Row
          type="flex"
          style={{ alignItems: "center" }}
          justify="center"
          gutter={4}
        >
          <Col md={8} xs={24}>
            <Card title={`Deposit`}>
              <Form.Item label="Nominal Cepat">
                <Row gutter={4}>
                  {caraCepat.map((res, key) => {
                    return (
                      <Col xs={8} sm={8} md={8} key={key} className="mb-2">
                        <Button
                          style={{ width: "100%" }}
                          type={isActiveAmount === key ? `danger` : `dashed`}
                          key={key}
                          onClick={(e) => {
                            setIsActiveAmount(key);
                            form.setFieldsValue({ amount: res });
                          }}
                        >
                          <small>{general_helper.toRp(res)}</small>
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
              </Form.Item>
              <Form.Item
                label="Nominal"
                hasFeedback
                onChange={onChange}
                name="amount"
                rules={[
                  { required: true, message: "Tidak Boleh Kosong" },
                  {
                    pattern: new RegExp(/^[0-9]*$/),
                    message: "Harus Berupa Angka",
                  },
                  {
                    validator(_, value) {
                      if (nominalError.enable) {
                        return Promise.reject(nominalError.helpText);
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  style={{ fontSize: state.mobile ? "12px" : "14px" }}
                  prefix={"Rp."}
                  ref={nominalInput}
                />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="payment_channel"
                label="Metode Pembayaran"
                rules={[{ required: true, message: "Tidak Boleh Kosong" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  optionFilterProp="children"
                  onChange={(e, i) =>
                    form.setFieldsValue({ payment_channel: e })
                  }
                  onSearch={() => {}}
                >
                  {data.length > 0 &&
                    data.map((val, key) => {
                      return (
                        <Option key={key} value={val.code}>
                          {val.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Button
                type="primary"
                size={"medium"}
                style={{ width: "100%" }}
                htmlType="submit"
              >
                Lanjut
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>

      {modalPin && (
        <ModalPin
          loading={loadingDeposit}
          submit={(pin) => {
            handleFinish(pin);
          }}
          cancel={(isShow) => {
            setModalPin(false);
          }}
          modalPin={modalPin}
        />
      )}
    </Spin>
  );
};

export default FormDeposit;
