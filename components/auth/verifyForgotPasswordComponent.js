import { Button, Col, Row, Input, Upload, Modal, Form, Tabs, Spin } from "antd";
import {
  InfoCircleOutlined,
  InboxOutlined,
  SolutionOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";

import { useState, useEffect } from "react";
import general_helper from "../../helper/general_helper";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordAction } from "../../redux/actions/auth.action";
import authAction from "../../action/auth.action";

const { TabPane } = Tabs;
const { Dragger } = Upload;

const VerifyForgotPasswordComponent = () => {
  const dispatch = useDispatch();

  console.log("verify forgot password page");
  const [form] = Form.useForm();
  const { loadingVerifyForgotPassword } = useSelector(
    (state) => state.authUserReducer
  );

  const handleSubmit = async (e) => {
    dispatch(sendForgotPasswordAction(e));
  };

  return (
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
              >
                Simpan
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VerifyForgotPasswordComponent;
