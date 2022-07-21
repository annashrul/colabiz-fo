import {
  Caption,
  Figure,
  Image,
  SubTitle,
  Title,
} from "../../components/styles/Tile";
import { Col, Row, Button, Collapse, Spin, Empty, Badge, Divider } from "antd";
const { Panel } = Collapse;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRewardAction } from "../../redux/actions/reward.action";
import general_helper from "../../helper/general_helper";
import { CaretRightOutlined } from "@ant-design/icons";

let images = [];

for (let num = 1; num <= 20; num += 1) {
  images.push(num);
}

const Index = () => {
  const dispatch = useDispatch();
  const { loadingReward, dataReward, paginationReward } = useSelector(
    (state) => state.rewardReducer
  );
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  useEffect(() => {
    dispatch(getRewardAction("?page=1"));
  }, []);

  const toText = ["PERTAMA", "KEDUA", "KETIGA"];

  return (
    <Spin spinning={loadingReward}>
      <Row type="flex" gutter={4}>
        <Col md={24} xs={24} sm={24}>
          <Divider>REWARD CLUSTER {toText[step - 1]}</Divider>
        </Col>
        <Col md={24} xs={24} sm={24} className="mb-2">
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="site-collapse-custom-collapse"
            onChange={(e) => {}}
          >
            <Panel header={`cara menggunakan fitur reward`}>
              <ul style={{ fontSize: "12px", paddingLeft: "20px" }}>
                <li>
                  Pastikan poin anda mencukupi untuk mendapatkan hadiah ini
                </li>
                <li>
                  Jumlah poin dari hadiah bisa dilihat di label berwarna orange
                </li>
                <li>
                  Sentuh atau klik hadiah yang akan dipilih di bagian gambar
                </li>
              </ul>
            </Panel>
          </Collapse>
        </Col>

        {dataReward !== undefined ? (
          dataReward.map((res, key) => (
            <Col xl={6} lg={8} sm={12} xs={12} key={key}>
              <Badge.Ribbon text={`${res.poin} POIN`} color="orange">
                <Figure
                  height={300}
                  style={{
                    borderRadius: "10px",
                    alignItems: "center",
                    alignContent: "center",
                    zIndex: "0",
                    filter: step > 1 ? "blur(3px)" : "",
                  }}
                >
                  <Image source={res.picture} alt={`image ${key}`} />
                  <Caption className={`footer`}>
                    <Title>{res.title}</Title>
                    <SubTitle>{general_helper.rmHtml(res.caption)}</SubTitle>
                    <Button
                      className="mt-2"
                      size="small"
                      type="dashed"
                      danger
                      //   onClick={(e) => step < 3 && setStep(step + 1)}
                    >
                      KLAIM
                    </Button>
                  </Caption>
                </Figure>
              </Badge.Ribbon>
            </Col>
          ))
        ) : (
          <Col md={24} xs={24} sm={24}>
            <Empty />
          </Col>
        )}
        <Col md={24} xs={24} sm={24} className="mt-2">
          <Button
            style={{ float: "right" }}
            type="primary"
            onClick={(e) => step < 3 && setStep(step + 1)}
          >
            Lihat Reward Lainnya
          </Button>
          {step > 1 && (
            <Button
              style={{ float: "right", marginRight: "10px" }}
              onClick={(e) => step > 1 && setStep(step - 1)}
            >
              Kembali
            </Button>
          )}
        </Col>
      </Row>
    </Spin>
  );
};

export default Index;
