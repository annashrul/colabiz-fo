import { Col, Row, Input, Button, Form, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cityAction,
  districtsAction,
  provinceAction,
} from "../../redux/actions/address.action";
import general_helper from "../../helper/general_helper";
import PhoneInput from "react-phone-number-input";
import HandphoneComponent from "../HandphoneComponent";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const FormAddress = ({ dataOld, callback, isFull = false }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [noHp, setNoHp] = useState();
  const {
    dataProvince,
    loadingProvince,
    dataCity,
    loadingCity,
    dataDistricts,
    loadingDistricts,
  } = useSelector((state) => state.addressReducer);
  const handleChangeAddress = (value, col = "") => {
    let objData = Object.assign(data, { [col]: value });
    setData(objData);
    if (col === "prov") {
      form.setFieldsValue({ kd_kota: undefined });
      form.setFieldsValue({ kd_kec: undefined });
      dispatch(cityAction(value));
    } else if (col === "kota") {
      form.setFieldsValue({ kd_kec: undefined });
      dispatch(districtsAction(value));
    }
  };

  useEffect(() => {
    dispatch(provinceAction());
    if (Object.keys(dataOld).length === 4) {
      dispatch(cityAction(dataOld.prov));
      dispatch(districtsAction(dataOld.kota));
      form.setFieldsValue({ kd_prov: dataOld.prov });
      form.setFieldsValue({ kd_kota: dataOld.kota });
      form.setFieldsValue({ kd_kec: dataOld.kecamatan });
      form.setFieldsValue({ main_address: dataOld.main_address });
      setData(dataOld);
    }
    if (isFull) {
      dispatch(cityAction(dataOld.kd_prov));
      dispatch(districtsAction(dataOld.kd_kota));
      setNoHp(general_helper.checkNo(dataOld.no_hp));
      form.setFieldsValue({ kd_prov: dataOld.kd_prov });
      form.setFieldsValue({ kd_kota: dataOld.kd_kota });
      form.setFieldsValue({ kd_kec: dataOld.kd_kec });
      form.setFieldsValue({ main_address: dataOld.main_address });
      form.setFieldsValue({ title: dataOld.title });
      form.setFieldsValue({ penerima: dataOld.penerima });
      form.setFieldsValue({
        no_hp: `${general_helper.checkNo(dataOld.no_hp)}`,
      });
      setData(dataOld);
    }
  }, []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(e) => {
          let newData = data;
          if (isFull) {
            // Object.assign(newData, { no_hp: noHp.replaceAll("+", "") });
            Object.assign(newData, { no_hp: form.getFieldValue("no_hp") });
          }
          // console.log(newData);
          callback("submit", newData);
        }}
      >
        {isFull && (
          <Form.Item
            hasFeedback
            name={"title"}
            label="Simpan alamat sebagai"
            rules={[{ required: true, message: msgInput }]}
          >
            <Input
              placeholder="Rumah"
              onChange={(e) => {
                let datas = Object.assign(data, { title: e.target.value });
                setData(datas);
              }}
            />
          </Form.Item>
        )}
        {isFull && (
          <Form.Item
            hasFeedback
            name={"penerima"}
            label="Penerima"
            rules={[{ required: true, message: msgInput }]}
          >
            <Input
              placeholder="Jhon Doe"
              onChange={(e) => {
                let datas = Object.assign(data, { penerima: e.target.value });
                setData(datas);
              }}
            />
          </Form.Item>
        )}
        {isFull && (
          <Form.Item
            hasFeedback
            name={"no_hp"}
            label="Telepon"
            rules={[
              { required: true, message: msgInput },
              { min: 9, message: "no handphone tidak valid" },
              { max: 16, message: "no handphone tidak valid" },
            ]}
          >
            {/* <PhoneInput
              country={"us"}
              value={noHp}
              onChange={(phone) =>setNoHp(phone)}
            /> */}
            <Input />
            {/* <HandphoneComponent
              callback={(e) => {
                setNoHp(e);
                console.log("receive ", e);
              }}
              val={dataOld.no_hp}
            /> */}
            {/* <PhoneInput
              international
              defaultCountry="ID"
              placeholder="81223165XXXX"
              value={noHp}
              onChange={setNoHp}
            /> */}
          </Form.Item>
        )}

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
              option.children.toLowerCase().includes(input.toLowerCase())
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
              option.children.toLowerCase().includes(input.toLowerCase())
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
              option.children.toLowerCase().includes(input.toLowerCase())
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
          <Input.TextArea
            onChange={(e) => {
              let datas = Object.assign(data, { main_address: e.target.value });
              setData(datas);
            }}
            placeholder="Ex: Jln Kebon Manggu Rt 02/04 No.112"
          />
        </Form.Item>

        <Form.Item shouldUpdate={true}>
          <Row gutter={8}>
            <Col md={12} xs={12} sm={12}>
              <Button
                style={{ width: "100%" }}
                type="dashed"
                htmlType="button"
                onClick={(e) => {
                  callback("cancel", data);
                }}
              >
                Kembali
              </Button>
            </Col>
            <Col md={12} xs={12} sm={12}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                className=""
              >
                Lanjut
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormAddress;
