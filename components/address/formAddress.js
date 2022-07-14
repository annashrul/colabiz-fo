import { Col, Row, Input, Button, Form, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cityAction,
  districtsAction,
  provinceAction,
} from "../../redux/actions/address.action";
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const FormAddress = ({ dataOld, callback }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState({});
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
      setData(dataOld);
      dispatch(cityAction(dataOld.prov));
      dispatch(districtsAction(dataOld.kota));
      form.setFieldsValue({ kd_prov: dataOld.prov });
      form.setFieldsValue({ kd_kota: dataOld.kota });
      form.setFieldsValue({ kd_kec: dataOld.kecamatan });
      form.setFieldsValue({ main_address: dataOld.main_address });
    }
  }, []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(e) => {
          // console.log("data", data);
          callback("submit", data);
        }}
      >
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
