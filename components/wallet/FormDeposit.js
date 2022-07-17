import { Button, Form, Row, Col, Select, Input, Card, Spin } from "antd";

import React, { useRef, useEffect, useState } from "react";
import ModalPin from "../ModalPin";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import authAction from "../../action/auth.action";
import general_helper from "../../helper/general_helper";
import { depositAction } from "../../redux/actions/wallet.action";
import { paymentChannelAction } from "../../redux/actions/paymentChannel.action";
import { getConfigAction } from "../../redux/actions/info.action";
const { Option } = Select;
import CurrencyComponent from "../CurrencyComponent";

const FormDeposit = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [modalPin, setModalPin] = useState(false);
  const [user, setUser] = useState({});
  const [dataDeposit, setDataDeposit] = useState({});
  const [amountActive, setAmountActive] = useState("0");

  const [nominalError, setNominalError] = useState({
    enable: false,
    helpText: "-",
  });
  const nominalErrorRef = useRef(nominalError);
  const nominalInput = useRef(null);

  const { loadingConfig, dataConfig } = useSelector(
    (state) => state.infoReducer
  );
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
    dispatch(getConfigAction());
    dispatch(paymentChannelAction());
    setUser(authAction.getUser());
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      form.setFieldsValue({ payment_channel: data[0].code });
    }
  }, [data]);

  const handleFinish = (pin) => {
    Object.assign(dataDeposit, {
      member_pin: pin,
    });
    console.log(dataDeposit);

    dispatch(depositAction(dataDeposit));
  };

  const handleSubmit = async (e) => {
    if (parseInt(e.amount, 10) < parseInt(dataConfig.min_deposit, 10)) {
      setNominalError({
        enable: true,
        helpText: `minimal deposit sebesar ${general_helper.toRp(
          dataConfig.min_deposit
        )}`,
      });
      return;
    }
    setModalPin(true);
    setDataDeposit(e);
  };

  return (
    <Spin spinning={loading || loadingConfig}>
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
            <Card
              title={`Deposit minimal ${general_helper.toRp(
                dataConfig ? dataConfig.min_deposit : 0
              )}`}
            >
              <Form.Item label="Nominal Cepat">
                <CurrencyComponent
                  callback={(res) => form.setFieldsValue({ amount: res })}
                  val={amountActive}
                />
              </Form.Item>
              <Form.Item
                label="Nominal"
                hasFeedback
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
                  onChange={(e) => setAmountActive(e.target.value)}
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
