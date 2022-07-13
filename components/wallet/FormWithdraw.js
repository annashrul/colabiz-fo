import {
  Button,
  PageHeader,
  Popconfirm,
  notification,
  Form,
  Row,
  Col,
  Select,
  Radio,
  Input,
  Card,
  message,
  Space,
  Modal,
  Spin,
} from "antd";
import {
  InfoCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import React, { useRef, useEffect, useState } from "react";
import { theme } from "../styles/GlobalStyles";
import Helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";

import { handleGet, handlePost } from "../../action/baseAction";
import ModalPin from "../ModalPin";
import Action from "../../action/auth.action";
import Router from "next/router";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import authAction from "../../action/auth.action";
import general_helper from "../../helper/general_helper";
import { withdrawAction } from "../../redux/actions/wallet.action";
const { Option } = Select;
const { confirm } = Modal;
const FormWithdraw = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [modalPin, setModalPin] = useState(false);
  const [fontSize, setFontSize] = useState("14px");
  const [isActiveAmount, setIsActiveAmount] = useState("");
  const [bank, setBank] = useState([]);
  const [user, setUser] = useState({});
  const [dataWd, setDataWd] = useState({});
  const [nominalError, setNominalError] = useState({
    enable: false,
    helpText: "-",
  });
  const nominalErrorRef = useRef(nominalError);
  const nominalInput = useRef(null);

  const { loadingWithdraw } = useSelector((state) => state.walletReducer);
  useEffect(() => {
    if (state.mobile) {
      setFontSize("80%");
    }
    nominalErrorRef.current = nominalError;
    if (nominalError.enable) {
      nominalInput.current.focus();
      form.validateFields();
    }
  }, [nominalError]);
  useEffect(() => {
    if (state.mobile) {
      setFontSize("80%");
    }
    setUser(authAction.getUser());
    setBank([authAction.getBank()]);
  }, [state]);
  useEffect(() => {
    if (bank.length > 0) {
      form.setFieldsValue({ id_bank: bank[0].id_bank });
    }
  }, [bank]);

  const onChange = (e) => {
    let val = e.target.value;

    if (parseInt(val, 10) > parseInt(user.saldo, 10)) {
      setNominalError({
        enable: true,
        helpText: "nominal penarikan melebihi saldo anda",
      });
    }
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
    Object.assign(dataWd, {
      member_pin: pin,
      acc_name: bank[0].acc_name,
      acc_no: bank[0].acc_no,
    });
    dispatch(withdrawAction(dataWd));
    console.log(dataWd);
  };

  const handleSubmit = async (e) => {
    setModalPin(true);
    setDataWd(e);
    // dispatch(withdrawAction(e));
  };

  const caraCepat = [
    "100000",
    "200000",
    "300000",
    "400000",
    "500000",
    "1000000",
  ];
  console.log(bank);
  return (
    <div>
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
              title={`Penarikan`}
              extra={`Saldo Anda ${general_helper.toRp(user.saldo)}`}
            >
              <Form.Item label="Nominal Cepat">
                <Row gutter={4}>
                  {caraCepat.map((res, key) => {
                    return (
                      <Col md={8} sm={8} xs={8} key={key} className="mb-2">
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
                label="Nominal Yang Akan Ditarik"
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
                >
                  {bank.map((val, key) => {
                    return (
                      <Option key={key} value={val.id_bank}>
                        {val.bank_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {/* <Popconfirm
                visible={visible}
                title="Anda yakin akan meneruskan transaksi ini ?"
                onConfirm={(e) => handleSubmit()}
                okText="Oke"
                cancelText="Batal"
                onCancel={() => setVisible(false)}
                okButtonProps={{
                  loading: loadingWithdraw,
                }}
              >
                <Button
                  type="primary"
                  onClick={(e) => setVisible(true)}
                  size={"medium"}
                  style={{ width: "100%" }}
                  htmlType="button"
                >
                  Lanjut
                </Button>
              </Popconfirm> */}
              <Button
                type="primary"
                // onClick={(e) => setVisible(true)}
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
    </div>
  );
};

export default FormWithdraw;