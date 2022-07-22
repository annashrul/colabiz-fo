import { Button, Col, Row, Input, Modal, Form, Spin } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordAction } from "../../redux/actions/auth.action";

const SendForgotPasswordComponent = ({ isModal, ok, cancel }) => {
  const dispatch = useDispatch();
  const [verifyPass, setVerifyPass] = useState(false);

  const [form] = Form.useForm();
  const { loadingSendForgotPassword } = useSelector(
    (state) => state.authUserReducer
  );

  const handleSubmit = async (e) => {
    // setVerifyPass(true);
    dispatch(sendForgotPasswordAction(e));
  };

  return (
    <>
      <Modal
        centered
        title="Form Lupa Password"
        visible={isModal}
        closable={false}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={loadingSendForgotPassword}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              hasFeedback
              name={"email"}
              label="Email"
              rules={[
                { required: true, message: "tidak boleh kosong" },
                {
                  type: "email",
                  message: "Email yang anda masukan tidak valid",
                },
              ]}
              tooltip={{
                title: "masukan email yang sudah terdaftar",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input placeholder="Ex: jhondoe@gmail.com" />
            </Form.Item>
            <Form.Item
              hasFeedback
              name={"username"}
              label="Username"
              rules={[
                { required: true, message: "tidak boleh kosong" },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                  message:
                    "Tidak boleh memasukan selain huruf,angka dan tanpa spasi",
                },
              ]}
              tooltip={{
                title: "hanya diperbolehkan huruf,angka dan tanpa spasi",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input placeholder="Ex: jhondoe" />
            </Form.Item>

            <Row gutter={12} className="mt-5">
              <Col xs={12} sm={12} md={12}>
                <Button
                  onClick={() => cancel()}
                  type={"dashed"}
                  size={"medium"}
                  style={{ width: "100%" }}
                  htmlType="button"
                >
                  Batal
                </Button>
              </Col>
              <Col xs={12} sm={12} md={12}>
                <Button
                  type={"primary"}
                  size={"medium"}
                  style={{ width: "100%" }}
                  htmlType="submit"
                  loading={loadingSendForgotPassword}
                >
                  Lanjut
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      {/* {verifyPass && <VerifyForgotPasswordComponent />} */}
    </>
  );
};

export default SendForgotPasswordComponent;
