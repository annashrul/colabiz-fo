import { Button, Form, Input, Spin, Message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { StringLink } from "../helper/string_link_helper";
import ModalPin from "./ModalPin";
import { handlePut } from "../action/baseAction";
import general_helper from "../helper/general_helper";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, setLoadingLogin } from "../redux/actions/auth.action";
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
  const [loading, setLoading] = useState(false);
  const [showModalPin, setShowModalPin] = useState(false);
  const [showModalResendEmail, setShowModalResendEmail] = useState(false);
  const [dataUser, setDataUser] = useState({});

  const resLogin = useSelector((state) => state.authUserReducer.dataLogin);
  const resLoading = useSelector((state) => state.authUserReducer.loadingLogin);

  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (form.getFieldValue("username") !== undefined) {
      if (resLogin.pin === "-") {
        Message.success("Anda Belum Mempunya Pin").then(() =>
          setShowModalPin(true)
        );
      } else if (resLogin.status === 3) {
        if (resLogin.kd_trx === "" || resLogin.kd_trx === "-") {
          Router.push(StringLink.transactionRecycle).then(() => {
            dispatch(setLoadingLogin(false));
          });
        } else {
          localStorage.setItem("linkBack", "/signin");
          localStorage.setItem("typeTrx", "Recycle");
          localStorage.setItem("kdTrx", resLogin.kd_trx);
          Router.push(StringLink.invoiceRecycle).then(() =>
            dispatch(setLoadingLogin(false))
          );
        }
      } else {
        Message.success(
          "Login Berhasil. Anda Akan Dialihkan Ke Halaman Dashboard!"
        ).then(() =>
          Router.push("/").then(() => dispatch(setLoadingLogin(false)))
        );
      }
      setDataUser(resLogin);
    }
  }, [resLogin]);

  const handleSubmit = async (values) => {
    dispatch(loginAction(values));
  };

  const handlePin = async (pin) => {
    setLoading(true);
    let data = Object.assign(dataUser, { pin: pin });
    await handlePut(
      `member/pin/${data.id}`,
      { pin: pin },
      (res, status, msg) => {
        if (status) {
          Message.success(
            "Berhasil membuat Pin. anda akan dialihkan ke halaman dashboard!"
          ).then(() => {
            Router.push("/").then(() => {
              setShowModalPin(false);
              setLoading(false);
            });
          });
        } else {
          setLoading(false);
        }
      }
    );
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

          <p className="text-right">
            <a
              onClick={() => {
                setShowModalResendEmail(true);
              }}
            >
              Resend Verifikasi
            </a>
          </p>
        </Spin>
      </Content>
      {showModalPin && (
        <ModalPin
          loading={loading}
          submit={(pin) => {
            handlePin(pin);
          }}
          cancel={(isShow) => {
            setShowModalPin(false);
          }}
          modalPin={showModalPin}
        />
      )}
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
