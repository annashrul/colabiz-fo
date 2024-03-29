import {
  Modal,
  Popconfirm,
  Row,
  Spin,
  Form,
  Input,
  Col,
  Button,
  Message,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { theme } from "./styles/GlobalStyles";
import dynamic from "next/dynamic";
const ReactCodeInput = dynamic(import("react-code-input"));

const ModalPin = ({ submit, cancel, modalPin, loading = false }) => {
  const [isModal, setIsModal] = useState(modalPin);
  const [pin, setPin] = useState("");
  const [focusPin, setFocusPin] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    setTimeout(() => setFocusPin(true), 300);
  }, [isModal, focusPin, pin]);

  return (
    <Modal
      title="Masukan Pin Anda"
      visible={isModal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
        <p>
          Demi Keamanan & Kenyamanan Menggunakan Sistem Ini, Pastikan Pin Yang
          Anda Masukan Sesuai
        </p>
        <Form form={form} layout="vertical" onFinish={(e) => submit(e.pin)}>
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
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button style={{ float: "right" }} type="primary" htmlType="submit">
              Simpan
            </Button>
            <Button
              onClick={(e) => cancel()}
              style={{ float: "right", marginRight: "5px" }}
              type="dashed"
              htmlType="button"
            >
              Batal
            </Button>
          </Form.Item>
        </Form>
        {/* <div>
          <p>
            Demi Keamanan & Kenyamanan Menggunakan Sistem Ini, Pastikan Pin Yang
            Anda Masukan Sesuai
          </p>
          <ReactCodeInput
            inputStyle={{
              marginRight: "3px",
              height: "30px",
              width: "30px",
              paddingLeft: "0px",
              borderRadius: "3px",
              color: theme.primaryColor,
              fontSize: "14px",
              textAlign: "center",
              verticalAlign: "middle",
              border: `1px solid ${theme.darkColor}`,
            }}
            value={pin}
            type="password"
            fields={6}
            onChange={(e) => {
              setPin(parseInt(e));
            }}
            autoFocus={focusPin}
            pattern={/^[0-9]*$/}
          />
          <Row gutter={12} className="mt-5" justify="end">
            <Col>
              <Button
                onClick={() => cancel(isModal)}
                type={"dashed"}
                size={"medium"}
                htmlType="button"
              >
                Batal
              </Button>
            </Col>
            <Col>
              <Popconfirm
                title="Anda yakin akan melanjutkan proses ini ?"
                onConfirm={(e) => {
                  if (!isNaN(pin)) {
                    const x = pin.toString().length;
                    setFocusPin(true);
                    if (x === 6) {
                      submit(pin.toString());
                    } else {
                      Message.info("Pin Harus 6 Digit Angka");
                      setPin("");
                    }
                  } else {
                    Message.info("Pin Hanya Di Perbolehkan Angka");
                    setFocusPin(true);
                    setPin("");
                  }
                }}
                onCancel={() => {}}
                okText="Oke"
                okType="submit"
                cancelText="Batal"
              >
                <Button type={"primary"} size={"medium"}>
                  Lanjut
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </div> */}
      </Spin>
    </Modal>
  );
};

export default ModalPin;
