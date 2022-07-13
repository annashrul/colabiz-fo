import { Col, Row, Input, Button, Form, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bankGeneralAction } from "../../redux/actions/banks.action";
const { Option } = Select;
const msgInput = "Tidak Boleh Kosong";

const FormBank = ({ dataOld, callback }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const { dataBankGeneral, loadingBankGeneral } = useSelector(
    (state) => state.banksReducer
  );

  useEffect(() => {
    dispatch(bankGeneralAction());
    if (Object.keys(dataOld).length > 3) {
      console.log("data old", dataOld);
      setData(dataOld);
      form.setFieldsValue({ acc_name: dataOld.acc_name });
      form.setFieldsValue({ acc_no: dataOld.acc_no });
      form.setFieldsValue({ id_bank: dataOld.id_bank });
    }
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
        onFinish={(e) =>
          callback("submit", {
            id_bank: e.id_bank,
            acc_name: e.acc_name,
            acc_no: e.acc_no,
          })
        }
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
