import {
  Col,
  Row,
  Modal,
  Input,
  Card,
  Button,
  Form,
  Popconfirm,
  Radio,
} from "antd";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Action from "../../action/auth.action";
import { useAppState } from "../shared/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import { setValidateUsername } from "../../redux/actions/auth.action";
import { provinceAction } from "../../redux/actions/address.action";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import FormAddress from "../address/formAddress";
import FormBank from "../bank/formBank";
import { createStockisAction } from "../../redux/actions/stockis.action";

const msgInput = "Tidak Boleh Kosong";

const CreateStockis = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [form] = Form.useForm();
  const [checkedAdress, setCheckedAddress] = useState(0);
  const [checkedBanks, setCheckedBanks] = useState(0);
  const [alamat, setAlamat] = useState("-");
  const [objAddress, setObjAddress] = useState({});
  const [objBanks, setObjBanks] = useState({});
  const [objForm, setObjForm] = useState({});
  const [step, setStep] = useState(1);
  const [, forceUpdate] = useState();
  const { loading } = useSelector((state) => state.stockisReducer);

  useEffect(() => {
    forceUpdate({});
    setStep(1);
    let banks = Action.getBank();
    // console.log("banks", banks);
    let adress = Action.getAddress();
    setObjAddress(adress);
    setObjBanks(banks);
  }, []);

  const handleBackStep = (val) => {
    setStep(val);
    dispatch(setValidateUsername(false));
  };

  const handleStep = async (e) => {
    let dataForm = Object.assign(objForm, e);
    setObjForm(dataForm);

    if (step == 2) {
      onFinish();
    } else {
      setStep(step + 1);
    }
  };

  const onFinish = async () => {
    objForm.alamat.replaceAll(" ", "");
    let lat = objForm.alamat.split(",")[1];
    let long = objForm.alamat.split(",")[0];
    // console.log(objAddress);
    const data = {
      id_address: parseInt(checkedAdress, 10) === 1 ? "-" : objAddress.id,
      id_bank: parseInt(checkedBanks, 10) === 1 ? "-" : objBanks.id,
      name: objForm.name,
      mobile_no: objForm.mobile_no,
      email: objForm.email,
      long: long,
      lat: lat,
      pin: objForm.pin,
      data_bank:
        parseInt(checkedBanks, 10) === 1
          ? {
              id_bank: objBanks.id_bank,
              acc_name: objBanks.acc_name,
              acc_no: objBanks.acc_no,
            }
          : {},
      address:
        parseInt(checkedAdress, 10) === 1
          ? {
              main_address: objAddress.main_address,
              kd_prov: objAddress.prov,
              kd_kota: objAddress.kota,
              kd_kec: objAddress.kecamatan,
            }
          : {},
    };
    // console.log(data);
    dispatch(createStockisAction(data));
  };
  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log(latLng);
        form.setFieldsValue({ alamat: `${latLng.lng}, ${latLng.lat}` });
      })
      .catch((error) => console.error("Error", error));
  };

  const handleOnChange = (alamat) => {
    setAlamat(alamat);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="addressForm"
        onFinish={handleStep}
        initialValues={{
          checkedAddress: "0",
          checkedBanks: "0",
        }}
      >
        <Row
          type="flex"
          justify="center"
          style={{ alignItems: "center" }}
          gutter={10}
        >
          <Col md={8} xs={24}>
            <Card title={"Daftar Stokis"}>
              {step === 1 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <Form.Item
                      hasFeedback
                      name={"name"}
                      label="Nama Lengkap"
                      rules={[{ required: true, message: msgInput }]}
                      tooltip={{
                        title:
                          "Nama ini akan di gunakan juga sebagai nama akun bank anda",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input />
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
                      <Input prefix={"+62"} />
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
                      <Input placeholder="Contoh: gugel@gmail.com" />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      name="pin"
                      label="Pin"
                      rules={[
                        { required: true, message: "Tidak Boleh Kosong" },
                        { min: 6, message: "Harus 6 Angka" },
                        { max: 6, message: "Harus 6 Angka" },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: "Harus Berupa Angka",
                        },
                      ]}
                      tooltip={{
                        title: "Harus 6 Angka",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {step === 2 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <Form.Item
                      hasFeedback
                      name="alamat"
                      label="Tag Lokasi"
                      tooltip={{
                        title:
                          "ketikan nama jalan untuk mendapatkan longitude dan latitude",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <PlacesAutocomplete
                        value={alamat}
                        onClick={handleSelect}
                        onChange={handleOnChange}
                        onSelect={handleSelect}
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading,
                        }) => (
                          <div>
                            <Input
                              placeholder=""
                              {...getInputProps({
                                onClick: handleSelect,
                              })}
                            />

                            <div
                              className="autocomplete-dropdown-container"
                              style={{ width: "96%" }}
                            >
                              {loading && <div>Loading...</div>}
                              {suggestions.map((suggestion, i) => {
                                const className = suggestion.active
                                  ? "suggestion-item--active"
                                  : "suggestion-item";
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: "#000000",
                                      cursor: "pointer",
                                      color: "white",
                                    }
                                  : {
                                      backgroundColor: "white",
                                      cursor: "pointer",
                                    };
                                return (
                                  <div
                                    key={i}
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                    </Form.Item>
                    <Form.Item
                      name="checkedAddress"
                      label="Gunakan alamat yang sudah ada ?"
                      onChange={(e) => {
                        if (e.target.value === "1") {
                          dispatch(provinceAction());
                        }
                        setCheckedAddress(parseInt(e.target.value, 10));
                      }}
                      tooltip={
                        parseInt(checkedAdress, 10) === 1
                          ? {
                              title: "ubah alamat",
                              icon: (
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    console.log(objAddress);
                                    setCheckedAddress(1);
                                  }}
                                >
                                  <EditOutlined />
                                </span>
                              ),
                            }
                          : null
                      }
                    >
                      <Radio.Group
                        buttonStyle="outline"
                        style={{ width: "100%" }}
                      >
                        <Radio.Button value="0" style={{ width: "50%" }}>
                          Iya
                        </Radio.Button>
                        <Radio.Button value="1" style={{ width: "50%" }}>
                          Tidak
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="checkedBanks"
                      label="Gunakan akun bank yang sudah ada ?"
                      onChange={(e) => {
                        setCheckedBanks(parseInt(e.target.value, 10));
                      }}
                      tooltip={
                        parseInt(checkedBanks, 10) === 1
                          ? {
                              title: "ubah akun bank",
                              icon: (
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setCheckedBanks(1);
                                  }}
                                >
                                  <EditOutlined />
                                </span>
                              ),
                            }
                          : null
                      }
                    >
                      <Radio.Group
                        buttonStyle="outline"
                        style={{ width: "100%" }}
                      >
                        <Radio.Button value="0" style={{ width: "50%" }}>
                          Iya
                        </Radio.Button>
                        <Radio.Button value="1" style={{ width: "50%" }}>
                          Tidak
                        </Radio.Button>
                      </Radio.Group>
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
                            loading={loading}
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
                          loading={loading}
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
      {checkedAdress === 1 && (
        <Modal
          centered
          title="Form Alamat"
          visible={checkedAdress === 1}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
          footer={null}
        >
          <FormAddress
            dataOld={objAddress}
            callback={(param, e) => {
              console.log(e);
              if (param !== "cancel") {
                setObjAddress(e);
              }
              form.setFieldsValue({
                checkedAddress: param === "cancel" ? "0" : "1",
              });
              setCheckedAddress(param === "cancel" ? "0" : "1");
            }}
          />
        </Modal>
      )}
      {checkedBanks === 1 && (
        <Modal
          centered
          title="Form Bank"
          visible={checkedBanks === 1}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
          footer={null}
        >
          <FormBank
            dataOld={objBanks}
            callback={(param, e) => {
              console.log(e);
              if (param !== "cancel") {
                setObjBanks(e);
              }
              form.setFieldsValue({
                checkedBanks: param === "cancel" ? "0" : "1",
              });
              setCheckedBanks(param === "cancel" ? "0" : "1");
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default CreateStockis;
