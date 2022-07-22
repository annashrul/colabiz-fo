import {
  Card,
  Col,
  Row,
  Form,
  Tooltip,
  Typography,
  Input,
  Space,
  Button,
  Tag,
} from "antd";
import React from "react";
import general_helper from "../../helper/general_helper";
const BonusComponent = ({ info }) => {
  const tempInput = (label = "", val = "") => {
    return (
      <Form.Item label={<span style={{ color: "#389e0d" }}>{label}</span>}>
        <Input
          style={{
            backgroundColor: "#f6ffed",
            color: "#389e0d",
            border: "1px solid #389e0d",
          }}
          disabled
          addonBefore=""
          value={general_helper.toRp(parseInt(val, 10))}
        />
      </Form.Item>
    );
  };
  return (
    <Row gutter={4} className="mt-2">
      <Col className="mb-2" md={12} xs={24} sm={12}>
        <Card
          headStyle={{
            border: "1px solid #389e0d",
            color: "#389e0d",
          }}
          bodyStyle={{
            border: "1px solid #389e0d",
            color: "#389e0d",
          }}
          title="BONUS PLAN A"
          style={{
            backgroundColor: "#f6ffed",
          }}
        >
          <Form
            labelAlign="left"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            {tempInput("Bonus Sponsor", info.bonus_sponsor)}
            {tempInput("Happy Shopping", info.bonus_happy_shopping)}
            {tempInput("Leadership", info.bonus_leadership)}
            {tempInput(
              "TOTAL",
              parseInt(info.bonus_sponsor, 10) +
                parseInt(info.bonus_happy_shopping, 10) +
                parseInt(info.bonus_leadership, 10)
            )}
          </Form>
        </Card>
      </Col>
      <Col md={12} xs={24} sm={12}>
        <Card
          headStyle={{
            border: "1px solid #d3adf7",
            color: "#531dab",
          }}
          bodyStyle={{
            border: "1px solid #d3adf7",
            color: "#531dab",
          }}
          style={{
            backgroundColor: "#f9f0ff",
          }}
          title="BONUS PLAN B"
        >
          <Form
            labelAlign="left"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item
              label={<span style={{ color: "#531dab" }}>Bonus Generasi</span>}
            >
              <Space>
                <Input
                  style={{
                    border: "1px solid #531dab",
                    color: "#531dab",
                    backgroundColor: "#f6ffed",
                  }}
                  disabled
                  value={general_helper.toRp(info.saldo_generasi)}
                />
                {/* <Tag color="purple">KLAIM</Tag> */}
                <Button
                  disabled
                  style={{
                    border: "1px solid #531dab",
                    color: "#f6ffed",
                    backgroundColor: "#531dab",
                  }}
                >
                  KLAIM
                </Button>
              </Space>
            </Form.Item>
            <Form.Item
              label={<span style={{ color: "#531dab" }}>Poin Reward</span>}
            >
              <Space>
                <Input
                  style={{
                    border: "1px solid #531dab",
                    color: "#531dab",
                    backgroundColor: "#f6ffed",
                  }}
                  disabled
                  value={general_helper.toRp(info.poin)}
                />
                <Button
                  disabled
                  style={{
                    border: "1px solid #531dab",
                    color: "#f6ffed",
                    backgroundColor: "#531dab",
                  }}
                >
                  KLAIM
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default BonusComponent;
