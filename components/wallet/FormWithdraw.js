import {
  Button,
  Form,
  Row,
  Col,
  Divider,
  Select,
  Input,
  Card,
  Spin,
} from "antd";
import { WalletOutlined, BankOutlined } from "@ant-design/icons";

import React, { useRef, useEffect, useState } from "react";
import ModalPin from "../ModalPin";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import authAction from "../../action/auth.action";
import general_helper from "../../helper/general_helper";
import { withdrawAction } from "../../redux/actions/wallet.action";
import { getConfigAction } from "../../redux/actions/info.action";
import StatCard from "../shared/StatCard";
import CurrencyComponent from "../CurrencyComponent";
const { Option } = Select;
const FormWithdraw = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [modalPin, setModalPin] = useState(false);
  const [bank, setBank] = useState([]);
  const [user, setUser] = useState({});
  const [amountActive, setAmountActive] = useState("0");
  const [step, setStep] = useState(1);
  const [indexBank, setIndexBank] = useState(0);
  const [nominalError, setNominalError] = useState({
    enable: false,
    helpText: "-",
  });
  const nominalErrorRef = useRef(nominalError);
  const nominalInput = useRef(null);
  const { loadingConfig, dataConfig } = useSelector(
    (state) => state.infoReducer
  );
  const { loadingWithdraw } = useSelector((state) => state.walletReducer);
  useEffect(() => {
    nominalErrorRef.current = nominalError;
    if (nominalError.enable) {
      nominalInput.current.focus();
      form.validateFields();
    }
  }, [nominalError]);
  useEffect(() => {
    setUser(authAction.getUser());
    dispatch(getConfigAction());
    setBank([authAction.getBank()]);
  }, [state]);

  useEffect(() => {
    if (bank.length > 0) {
      form.setFieldsValue({ id_bank: bank[0].id });
    }
  }, [bank]);

  const handleFinish = (pin) => {
    let datas = {
      amount: form.getFieldValue("amount"),
      id_bank: form.getFieldValue("id_bank"),
      member_pin: pin,
    };
    dispatch(withdrawAction(datas));
  };

  const handleSubmit = async (e) => {
    if (parseInt(e.amount, 10) < parseInt(dataConfig.min_withdraw, 10)) {
      setNominalError({
        enable: true,
        helpText: `minimal penarikan sebesar ${general_helper.toRp(
          dataConfig.min_withdraw
        )}`,
      });
      return;
    } else if (parseInt(e.amount, 10) > parseInt(user.saldo, 10)) {
      setNominalError({
        enable: true,
        helpText: "nominal penarikan melebihi saldo anda",
      });
    } else {
      step === 1 ? setStep(2) : setModalPin(true);
    }
  };

  return (
    <Spin spinning={loadingConfig}>
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
              title={
                <span>
                  Penarikan minimal{" "}
                  {general_helper.toRp(
                    dataConfig ? dataConfig.min_withdraw : 0
                  )}
                  <br />
                  <small style={{ color: "green" }}>
                    <WalletOutlined /> Saldo {general_helper.toRp(user.saldo)}
                  </small>
                </span>
              }
            >
              {step === 1 && (
                <span>
                  <Form.Item label="Nominal Cepat">
                    <CurrencyComponent
                      callback={(res) => form.setFieldsValue({ amount: res })}
                      val={amountActive}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Nominal Yang Akan Ditarik"
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
                    name="id_bank"
                    label="Bank Tujuan"
                    rules={[{ required: true, message: "Tidak Boleh Kosong" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      showSearch
                      placeholder="Pilih Bank"
                      optionFilterProp="children"
                      onChange={(e, i) => form.setFieldsValue({ id_bank: e })}
                      onSearch={() => {}}
                      onSelect={(e, i) => setIndexBank(parseInt(i.key, 10))}
                    >
                      {bank.map((val, key) => {
                        return (
                          <Option key={key} value={val.id}>
                            {val.bank_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </span>
              )}

              {step === 2 && (
                <span>
                  <Divider plain>Jumlah Uang Yang Diterima</Divider>
                  <Button
                    style={{ width: "100%" }}
                    type="dashed"
                    danger
                    size={"large"}
                  >
                    {general_helper.toRp(
                      parseInt(form.getFieldValue("amount"), 10) -
                        parseInt(dataConfig.charge_withdraw, 10)
                    )}
                  </Button>
                  <Divider plain>Informasi Akun Bank</Divider>
                  <StatCard
                    value={
                      <span className="ml-4">{bank[indexBank].bank_name}</span>
                    }
                    title={
                      <span className="ml-4">
                        {`${bank[indexBank].acc_name}, ${bank[indexBank].acc_no}`}
                      </span>
                    }
                    icon={
                      <BankOutlined
                        style={{
                          fontSize: "20px",
                        }}
                      />
                    }
                  />
                  <Divider plain>Informasi Lainnya</Divider>

                  {general_helper.tempRow(
                    "Jumlah Penarikan",
                    general_helper.toRp(form.getFieldValue("amount")),
                    true
                  )}
                  {general_helper.tempRow(
                    "Biaya Admin",
                    general_helper.toRp(
                      dataConfig ? dataConfig.charge_withdraw : 0
                    ),
                    true
                  )}
                  {general_helper.tempRow(
                    "Uang Yang Diterima",
                    general_helper.toRp(
                      parseInt(form.getFieldValue("amount"), 10) -
                        parseInt(dataConfig.charge_withdraw, 10)
                    ),
                    true
                  )}
                </span>
              )}

              <Row type="flex" gutter={16} justify="end" className="mt-4">
                {step === 2 && (
                  <Button
                    className="mr-2"
                    type="dashed"
                    size={"medium"}
                    htmlType="button"
                    onClick={(e) => setStep(1)}
                  >
                    Kembali
                  </Button>
                )}
                <Button type="primary" size={"medium"} htmlType="submit">
                  Lanjut
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      {modalPin && (
        <ModalPin
          loading={loadingWithdraw}
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

export default FormWithdraw;
