import { Button, Col, Row, Input, Modal, Form, Spin, Alert } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendForgotPasswordAction,
  verifyForgotPasswordAction,
} from "../../redux/actions/auth.action";

const IndexVerifyForgot = () => {
  const dispatch = useDispatch();
  const [verifyPass, setVerifyPass] = useState(false);

  const [form] = Form.useForm();
  const { loadingVerifyForgotPassword } = useSelector(
    (state) => state.authUserReducer
  );

  const handleSubmit = async (e) => {
    // setVerifyPass(true);
    let data = {
      token: window.location.pathname.split("/")[2],
      password: e.password,
    };
    dispatch(verifyForgotPasswordAction(data));
  };
  //   console.log(window.location.pathname.split("/")[2]);

  return (
    <>
      <Modal
        centered
        title="Verifikasi Lupa Password"
        visible={true}
        closable={false}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={loadingVerifyForgotPassword}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Alert
              banner
              message="password ini digunakan untuk akun login anda"
            />
            <br />
            <Form.Item
              hasFeedback
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Tidak Boleh Kosong" },
                { min: 6, message: "Password minimal 6 Angka" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="confirm_password"
              label="Konfirmasi Password"
              rules={[
                { required: true, message: "Tidak Boleh Kosong" },
                {
                  min: 6,
                  message: "Konfirmasi password minimal 6 Angka",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password Tidak Sama"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Row gutter={12} className="mt-2">
              <Col xs={24} sm={24} md={24}>
                <Button
                  type={"primary"}
                  size={"medium"}
                  style={{ width: "100%" }}
                  htmlType="submit"
                  loading={loadingVerifyForgotPassword}
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

export default IndexVerifyForgot;
