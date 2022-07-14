import { Button, Form, Input, Spin, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import general_helper from "../helper/general_helper";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../redux/actions/auth.action";
import ModalResendEmail from "./modalResendEmail";

const FormItem = Form.Item;

const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

const Signin = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [showModalResendEmail, setShowModalResendEmail] = useState(false);
  const resLoading = useSelector((state) => state.authUserReducer.loadingLogin);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleSubmit = async (values) => {
    dispatch(loginAction(values));
  };

  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      className="px-3 bg-white mh-page"
      style={{ minHeight: "100vh" }}
    >
      <Content>
        <div className="text-center mb-4">
          <Link href="/signin">
            <a className="brand mr-0">
              <img src={general_helper.imgDefault} style={{ width: "100px" }} />
            </a>
          </Link>
          <h5 className="mb-0 mt-3">Sign in Member</h5>
        </div>
        <Spin spinning={resLoading}>
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <FormItem
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Username tidak boleh kosong!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize: "16px" }} />}
                type="text"
                placeholder="Username"
              />
            </FormItem>

            <FormItem
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password tidak boleh kosong!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined style={{ fontSize: "16px" }} />}
              />
            </FormItem>
            <div className="text-center">
              <small className="text-muted">
                <span>Kirim ulang link verifikasi?</span>{" "}
                <a onClick={() => setShowModalResendEmail(true)}>
                  &nbsp;Kirim sekarang!
                </a>
              </small>
            </div>
            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="mt-3"
                  style={{ width: "100%" }}
                  loading={resLoading}
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length
                  }
                >
                  Log in
                </Button>
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Content>

      {showModalResendEmail && (
        <ModalResendEmail
          modal={showModalResendEmail}
          onCancel={() => {
            setShowModalResendEmail(false);
          }}
        />
      )}
    </Row>
  );
};

export default Signin;
