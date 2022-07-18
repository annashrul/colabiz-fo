import { Col, Row, Input, Card, Button, Form, Select, Popconfirm } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef } from "react";
import Action from "../../action/auth.action";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingValidateUsername,
  setValidateUsername,
  signUpAction,
  validateUsernameAction,
} from "../../redux/actions/auth.action";
import {
  cityAction,
  districtsAction,
  provinceAction,
} from "../../redux/actions/address.action";
import { bankGeneralAction } from "../../redux/actions/banks.action";
import PhoneInput from "react-phone-number-input";

const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const TambahMitra = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [iconLoading, setIconLoading] = useState(false);
  const [user, setUser] = useState({});
  const [dataForm, setDataForm] = useState({});
  const [info, setInfo] = useState({});
  const [step, setStep] = useState(1);
  const [, forceUpdate] = useState();
  const usernameInput = useRef(null);
  const [usernameError, setUsernameError] = useState({
    enable: false,
    helpText: "-",
  });
  const usernameErrorRef = useRef(usernameError);

  const { validateUsername, loadingValidateUsername, loadingSignUp } =
    useSelector((state) => state.authUserReducer);

  const {
    dataProvince,
    loadingProvince,
    dataCity,
    loadingCity,
    dataDistricts,
    loadingDistricts,
  } = useSelector((state) => state.addressReducer);
  const { dataBankGeneral, loadingBankGeneral } = useSelector(
    (state) => state.banksReducer
  );

  useEffect(() => {
    usernameErrorRef.current = usernameError;
    if (usernameError.enable) {
      usernameInput.current.focus();
      form.validateFields();
    }
  }, [usernameError]);

  useEffect(() => {
    setInfo(Action.getInfo());
    setUser(Action.getUser());
    forceUpdate({});
    setValidateUsername(false);
    setLoadingValidateUsername(false);
    setStep(1);
  }, []);
  useEffect(() => {
    setIconLoading(loadingSignUp);
  }, [loadingSignUp]);

  useEffect(() => {
    if (form.getFieldValue("fullname") !== undefined) {
      setIconLoading(loadingValidateUsername);
    }
  }, [loadingValidateUsername]);

  const handleChangeAddress = (value, col = "") => {
    if (col === "prov") {
      form.setFieldsValue({ kd_kota: undefined });
      form.setFieldsValue({ kd_kec: undefined });
      dispatch(cityAction(value));
    } else if (col === "kota") {
      form.setFieldsValue({ kd_kec: undefined });
      dispatch(districtsAction(value));
    }
  };
  const handleBackStep = (val) => {
    setStep(val);
    dispatch(setValidateUsername(false));
  };

  const handleStep = async (e) => {
    if (step === 1) {
      setValue(value.replaceAll("+", ""));
      dispatch(
        validateUsernameAction(e.username, (res) => {
          if (res !== "") {
            usernameInput.current.focus();
            setUsernameError({
              enable: true,
              helpText: res,
            });
          } else {
            dispatch(provinceAction());
            setTimeout(() => setStep(2), 300);
          }
        })
      );
      Object.assign(dataForm, e);
      setDataForm(dataForm);
      form.setFieldsValue({ acc_name: e.fullname });
    } else if (step === 2) {
      Object.assign(dataForm, e);
      setDataForm(dataForm);
      dispatch(bankGeneralAction());
      if (form.getFieldValue("kd_kec") !== undefined) {
        setStep(3);
      }
    } else {
      Object.assign(dataForm, e);
      setDataForm(dataForm);
      onFinish();
    }
  };

  const onFinish = async () => {
    const data = {
      fullname: dataForm.fullname,
      mobile_no: value,
      username: dataForm.username,
      email: dataForm.email,
      sponsor: user.referral,
      data_bank: {
        id_bank: dataForm.id_bank,
        acc_name: dataForm.acc_name,
        acc_no: dataForm.acc_no,
      },
      address: {
        main_address: dataForm.main_address,
        kd_prov: dataForm.kd_prov,
        kd_kota: dataForm.kd_kota,
        kd_kec: dataForm.kd_kec,
      },
    };
    dispatch(signUpAction(data));
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
        onChange={() => {
          if (usernameError.enable) {
            setUsernameError({ enable: false, helpText: "" });
          }
        }}
      >
        <Row
          type="flex"
          justify="center"
          style={{ alignItems: "center" }}
          gutter={10}
        >
          <Col md={8} xs={24}>
            <Card title={`Sponsor ${user.referral}`}>
              {step === 1 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <h5>Lengkapi Form Data Mitra Anda</h5>
                    <br />

                    <Form.Item
                      hasFeedback
                      name={"fullname"}
                      label="Nama Lengkap"
                      rules={[{ required: true, message: msgInput }]}
                      tooltip={{
                        title:
                          "Nama ini akan di gunakan juga sebagai nama akun bank anda",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input placeholder="Ex: Jhon Doe" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="mobile_no"
                      label="No Telepon"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        // {
                        //   pattern: new RegExp(/^[0-9]*$/),
                        //   message: "Harus Berupa Angka",
                        // },
                        { min: 9, message: "no handphone tidak valid" },
                        { max: 14, message: "no handphone tidak valid" },
                      ]}
                      tooltip={{
                        title: "Pastikan no telepon anda aktif",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <PhoneInput
                        international
                        defaultCountry="ID"
                        placeholder="81223165XXXX"
                        value={value}
                        onChange={setValue}
                      />
                      {/* <Input prefix={"+62"} placeholder="81223165XXXX" /> */}
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
                        {
                          validator(_, value) {
                            if (usernameError.enable) {
                              return Promise.reject(usernameError.helpText);
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      tooltip={{
                        title:
                          "hanya diperbolehkan huruf,angka dan tanpa spasi",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input
                        ref={usernameInput}
                        style={{ textTransform: "lowercase" }}
                        placeholder="Ex: jhondoe"
                      />
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
                  <Col md={24} xs={24} sm={24}>
                    <h5>Lengakapi Form Alamat Anda</h5>
                    <Form.Item
                      hasFeedback
                      name="kd_prov"
                      label="Provinsi"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Select
                        loading={loadingProvince}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Pilih Provinsi"
                        optionFilterProp="children"
                        onChange={(e) => handleChangeAddress(e, "prov", 0)}
                        onSearch={(e) => {}}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {dataProvince.map((val, key) => {
                          return (
                            <Option key={key} value={val.id}>
                              {val.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="kd_kota"
                      label="Kota"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Select
                        loading={loadingCity}
                        disabled={dataCity.length < 1}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Pilih Kota"
                        optionFilterProp="children"
                        onChange={(e) => handleChangeAddress(e, "kota", 0)}
                        onSearch={(e) => {}}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {dataCity.map((val, key) => {
                          return (
                            <Option key={key} value={val.id}>
                              {val.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="kd_kec"
                      label="Kecamatan"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Select
                        loading={loadingDistricts}
                        disabled={dataDistricts.length < 1}
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Pilih Kecamatan"
                        optionFilterProp="children"
                        onChange={(e) => handleChangeAddress(e, "kecamatan", 0)}
                        onSearch={(e) => {}}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {dataDistricts.map((val, key) => {
                          return (
                            <Option key={key} value={val.id}>
                              {val.kecamatan}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name={"main_address"}
                      label="Alamat Lengkap"
                      rules={[
                        { required: true, message: msgInput },
                        { min: 20, message: "minimal 20 karakter" },
                      ]}
                      tooltip={{
                        title:
                          "Masukan alamat anda dari nama jalan,rt,rw,blok rumah, no rumah",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input.TextArea placeholder="Ex: Jln Kebon Manggu Rt 02/04 No.112" />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {step === 3 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <h5>Lengakapi Form Akun Bank Anda</h5>
                    <Form.Item
                      hasFeedback
                      name={"acc_name"}
                      label="Atas Nama"
                      rules={[{ required: true, message: msgInput }]}
                      tooltip={{
                        title:
                          "Atas nama ini diambil dari form isian nama yang anda masukan sebelumnya",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input disabled={true} placeholder="Ex: Jhon Doe" />
                    </Form.Item>

                    <Form.Item
                      hasFeedback
                      name="acc_no"
                      label="No Rekening"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Harus Berupa Angka",
                        },
                        { min: 10, message: "no rekening tidak valid" },
                      ]}
                      tooltip={{
                        title: "Minimal 10 Angka",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input placeholder="XXXXXXXX" />
                    </Form.Item>

                    <Form.Item
                      hasFeedback
                      name="id_bank"
                      label="Bank"
                      rules={[{ required: true, message: msgInput }]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Pilih Bank"
                        optionFilterProp="children"
                        onChange={(e, i) => form.setFieldsValue({ id_bank: e })}
                        onSearch={() => {}}
                      >
                        {dataBankGeneral.map((val, key) => {
                          return (
                            <Option key={key} value={val.id}>
                              {val.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={8}>
                {step !== 1 && (
                  <Col md={12} xs={12} sm={12}>
                    <Form.Item shouldUpdate={true}>
                      {() => (
                        <Button
                          style={{ width: "100%" }}
                          type="dashed"
                          htmlType="button"
                          onClick={(e) => {
                            e.preventDefault();

                            handleBackStep(step - 1);
                          }}
                        >
                          Kembali
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                )}

                <Col
                  md={step === 1 ? 24 : 12}
                  xs={step === 1 ? 24 : 12}
                  sm={step === 1 ? 24 : 12}
                >
                  <Form.Item shouldUpdate={true}>
                    {() =>
                      step === 3 ? (
                        <Popconfirm
                          placement="top"
                          title="Anda yakin akan melanjutkan proses ini ?"
                          onConfirm={handleStep}
                          okText="Simpan"
                          cancelText="Batal"
                        >
                          <Button
                            loading={iconLoading}
                            style={{ width: "100%" }}
                            type="primary"
                            htmlType="submit"
                            className=""
                          >
                            Lanjut
                          </Button>
                        </Popconfirm>
                      ) : (
                        <Button
                          loading={iconLoading}
                          style={{ width: "100%" }}
                          type="primary"
                          htmlType="submit"
                          className=""
                        >
                          Lanjut
                        </Button>
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TambahMitra;
