import {
  Col,
  Collapse,
  Message,
  Row,
  Modal,
  Input,
  Card,
  Button,
  Form,
  Select,
  Popconfirm,
  Radio,
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
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const { Panel } = Collapse;
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const FormBank = ({ callback }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const { dataBankGeneral, loadingBankGeneral } = useSelector(
    (state) => state.banksReducer
  );

  useEffect(() => {
    dispatch(bankGeneralAction());
  }, []);

  const onChange = (e) => {
    let val = Object.assign(data, { [e.target.id]: e.target.value });
    setData(val);
  };

  console.log("data", data);
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(e) => callback("submit", data)}
      >
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
          <Input onChange={onChange} placeholder="Ex: Jhon Doe" />
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
          <Input onChange={onChange} placeholder="XXXXXXXX" />
        </Form.Item>

        <Form.Item
          hasFeedback
          name="id_bank"
          label="Bank"
          rules={[{ required: true, message: msgInput }]}
        >
          <Select
            loading={loadingBankGeneral}
            style={{ width: "100%" }}
            showSearch
            placeholder="Pilih Bank"
            optionFilterProp="children"
            onSelect={(e) => {
              console.log("select", e);
              let val = Object.assign(data, { id_bank: e });
              setData(val);
            }}
            onChange={(e, i) => {
              let val = Object.assign(data, { id_bank: e.id_bank });
              setData(val);
              form.setFieldsValue({ id_bank: e });
            }}
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

export default FormBank;
