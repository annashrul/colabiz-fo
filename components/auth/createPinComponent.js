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
import {
  createPinAction,
  putMemberAction,
} from "../../redux/actions/member.action";
import authAction from "../../action/auth.action";

const { TabPane } = Tabs;
const { Dragger } = Upload;

const CreatePinComponent = ({ isModal, ok, cancel }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.memberReducer);

  const handleSubmit = async (e) => {
    dispatch(
      createPinAction(authAction.getUser().id, e.pin, (res) => {
        ok(res);
      })
    );
  };
  return (
    <Modal
      centered
      title="Buat Pin"
      visible={isModal}
      closable={false}
      destroyOnClose={true}
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            tooltip={{
              title: "Harus 6 Angka",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="confirm_pin"
            label="Konfirmasi Pin"
            rules={[
              { required: true, message: "Tidak Boleh Kosong" },
              { min: 6, message: "Harus 6 Angka" },
              { max: 6, message: "Harus 6 Angka" },
              {
                pattern: new RegExp(/^[0-9]*$/),
                message: "Harus Berupa Angka",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("pin") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Pin Tidak Sama"));
                },
              }),
            ]}
            tooltip={{
              title: "Harus 6 Angka",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.Password />
          </Form.Item>

          <br />
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
                loading={loading}
              >
                Lanjut
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreatePinComponent;
