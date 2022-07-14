import { Modal, Input, Row, Form, Spin, Col, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendEmailAction } from "../redux/actions/auth.action";

const FormItem = Form.Item;

const ModalResendEmail = ({ modal, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const { loadingResendEmail } = useSelector((state) => state.authUserReducer);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleSubmit = (e) => {
    dispatch(
      resendEmailAction(e, (res) => {
        if (!res) {
          console.log("bansat", res);
          onCancel(res);
        }
      })
    );
  };

  return (
    <Modal
      title="Resend Verifikasi"
      visible={modal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Spin tip="Tunggu Sebentar..." size="large" spinning={loadingResendEmail}>
        <div>
          <p>masukan username anda untuk mengirim ulang verifikasi</p>
          <Form onFinish={handleSubmit} form={form} layout="vertical">
            <FormItem
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
              <Input
                style={{ textTransform: "lowercase" }}
                placeholder="masukan username anda"
              />
            </FormItem>
            <Row gutter={12}>
              <Col md={12} xs={12} sm={12}>
                <FormItem shouldUpdate={true}>
                  {() => (
                    <Button
                      style={{ width: "100%" }}
                      type="dashed"
                      htmlType="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        onCancel(false);
                      }}
                    >
                      Kembali
                    </Button>
                  )}
                </FormItem>
              </Col>
              <Col md={12} xs={12} sm={12}>
                <Form.Item shouldUpdate={true}>
                  {() => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                      loading={loadingResendEmail}
                      disabled={
                        !form.isFieldsTouched(true) ||
                        form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                      }
                    >
                      Kirim
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalResendEmail;
