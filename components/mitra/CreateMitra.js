import {
  Col,
  Collapse,
  Message,
  Row,
  Input,
  Card,
  Button,
  Form,
  Select,
  Popconfirm,
  Spin,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import { handleGet, handlePost } from "../../action/baseAction";
import Action from "../../action/auth.action";
import Router from "next/router";
import { StringLink } from "../../helper/string_link_helper";
import general_helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import { validateUsernameAction } from "../../redux/actions/auth.action";
import { provinceAction } from "../../redux/actions/address.action";

const { Panel } = Collapse;
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const TambahMitra = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [arrPaymentChannel, setArrPaymentChannel] = useState([]);
  const [arrProduct, setArrProduct] = useState([]);
  const [arrBank, setArrBank] = useState([]);
  const [iconLoading, setIconLoading] = useState(false);
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({});
  const [step, setStep] = useState(1);
  const [, forceUpdate] = useState();
  const [objBank, setObjBank] = useState({});
  const { validateUsername, loadingValidateUsername } = useSelector(
    (state) => state.authUserReducer
  );

  const { dataProvince, loadingProvince } = useSelector(
    (state) => state.addressReducer
  );

  const usernameInput = useRef(null);
  const [fontSize, setFontSize] = useState("12px");

  useEffect(() => {
    if (state.mobile) {
      setFontSize("80%");
    }
    setInfo(Action.getInfo());
    setUser(Action.getUser());
    forceUpdate({});
  }, []);
  useEffect(() => {
    if (step === 1 && loadingValidateUsername) {
      !validateUsername && usernameInput.current.focus();
    }
    if (!loadingValidateUsername && validateUsername) {
      setStep(2);
    }
    setIconLoading(loadingValidateUsername);
  }, [loadingValidateUsername]);

  const handleProduct = async () => {
    await handleGet(
      "paket?page=1&perpage=10&category=5d96d9f0-49bd-49e2-895f-f8171ba3a9ea",
      (datum, isLoading) => {
        setArrProduct(datum.data);
      }
    );
  };
  const handlePaymentChannel = async () => {
    await handleGet("transaction/channel", (datum, isLoading) => {
      setArrPaymentChannel(datum.data);
    });
  };
  const handleBank = async () => {
    await handleGet("transaction/data_bank", (datum, isLoading) => {
      setArrBank(datum.data);
    });
  };

  const handleStep = async (e) => {
    dispatch(validateUsernameAction(e.username));
  };

  const onFinish = async (e) => {
    const data = {
      fullname: form.getFieldValue("fullname"),
      mobile_no: general_helper.checkNo(form.getFieldValue("mobile_no")),
      username: form.getFieldValue("username"),
      password: form.getFieldValue("password"),
      sponsor: user.referral,
      payment_channel: form1.getFieldValue("payment_channel"),
      id_paket: form1.getFieldValue("id_paket"),
      data_bank: {
        id_bank: objBank.id,
        acc_name: form.getFieldValue("acc_name"),
        acc_no: form.getFieldValue("acc_no"),
      },
    };
    setIconLoading(true);
    await handlePost("auth/signup", data, (res, status, msg) => {
      if (status) {
        localStorage.setItem("linkBack", StringLink.tambahMitra);
        localStorage.setItem("typeTrx", "Mitra Baru");
        localStorage.setItem("kdTrx", res.data.kd_trx);
        Message.success(msg).then(() =>
          Router.push(StringLink.invoiceMitra).then(() => setIconLoading(false))
        );
        // onReset();
      } else {
        setIconLoading(false);
        // Message.info(msg).then(() => setIconLoading(false));
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const tempRow = (title, desc, isRp = true) => {
    return (
      <Row>
        <Col xs={10} md={10} style={{ alignItems: "left", textAlign: "left" }}>
          <small style={{ fontSize: fontSize }}>{title}</small>
        </Col>
        <Col
          xs={14}
          md={14}
          style={{ alignItems: "right", textAlign: "right" }}
        >
          <small style={{ fontSize: fontSize }}>
            {isRp ? general_helper.toRp(desc) : desc}
          </small>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="addressForm"
        onFinish={handleStep}
        initialValues={{
          sponsor: "NETINDO",
        }}
      >
        <Row
          type="flex"
          justify="center"
          style={{ alignItems: "center" }}
          gutter={10}
        >
          <Col md={8} xs={24}>
            <Card
              title={!state.mobile && "Mitra Baru"}
              extra={
                <Button size={"small"} type={"info"}>
                  {user.referral}
                </Button>
              }
            >
              {step === 1 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <Form.Item
                      hasFeedback
                      name={"fullname"}
                      label="Nama Lengkap"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Input placeholder="Ex: Jhon Doe" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="mobile_no"
                      label="No Telepon"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Harus Berupa Angka",
                        },
                        { min: 9, message: "no handphone tidak valid" },
                        { max: 14, message: "no handphone tidak valid" },
                      ]}
                      tooltip={{
                        title: "Pastikan no telepon anda aktif",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input prefix={"+62"} placeholder="81223165XXXX" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name={"username"}
                      label="Username"
                      rules={[
                        { required: true, message: msgInput },
                        {
                          pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                          message:
                            "Tidak boleh memasukan selain huruf,angka dan tanpa spasi",
                        },
                      ]}
                      tooltip={{
                        title:
                          "hanya diperbolehkan huruf,angka dan tanpa spasi",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input ref={usernameInput} placeholder="Ex: jhondoe" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name={"email"}
                      label="Email"
                      rules={[
                        { required: true, message: msgInput },
                        {
                          type: "email",
                          message: "Email yang anda masukan tidak valid",
                        },
                      ]}
                    >
                      <Input placeholder="Ex: jhondoe@gmail.com" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {step === 2 && (
                <Row>
                  <Col md={24} xs={24} sm={24}></Col>
                </Row>
              )}

              <Form.Item shouldUpdate={true} label={`   `}>
                {() => (
                  <Button
                    loading={iconLoading}
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                    className=""
                  >
                    Lanjut
                  </Button>
                )}
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TambahMitra;
