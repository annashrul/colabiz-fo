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
} from "antd";
import React from "react";
import general_helper from "../../helper/general_helper";
const BonusComponent = ({ info }) => {
  return (
    <Row gutter={4}>
      <Col md={12} xs={24} sm={12}>
        <Card title="BONUS PLAN A">
          <Form
            labelAlign="left"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item label="Bonus Sponsor">
              <Input
                disabled
                addonBefore=""
                value={general_helper.toRp(info.bonus_sponsor)}
              />
            </Form.Item>
            <Form.Item label="Happy Shopping">
              <Input
                disabled
                addonBefore=""
                value={general_helper.toRp(info.bonus_happy_shopping)}
              />
            </Form.Item>
            <Form.Item label="Leadership">
              <Input
                disabled
                addonBefore=""
                // addonAfter={<a>pending bonus</a>}
                value={general_helper.toRp(info.bonus_leadership)}
              />
            </Form.Item>
            <Form.Item label="TOTAL">
              <Input
                disabled
                addonBefore=""
                value={general_helper.toRp(
                  parseInt(info.bonus_sponsor, 10) +
                    parseInt(info.bonus_happy_shopping, 10) +
                    parseInt(info.bonus_leadership, 10)
                )}
              />
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col md={12} xs={24} sm={12}>
        <Card title="BONUS PLAN B">
          <Form
            labelAlign="left"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            <Form.Item label="Bonus Generasi">
              <Input
                disabled
                addonBefore=""
                addonAfter={
                  <Button size="small" disabled>
                    Klaim
                  </Button>
                }
                value={general_helper.toRp(info.saldo_generasi)}
              />
            </Form.Item>
            <Form.Item label="Poin Reward">
              <Input
                disabled
                addonBefore=""
                addonAfter={
                  <Button size="small" disabled>
                    Klaim
                  </Button>
                }
                value={general_helper.toRp(info.poin, true)}
              />
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default BonusComponent;
