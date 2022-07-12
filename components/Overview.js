import {
  RightCircleOutlined,
  CopyOutlined,
  WalletOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { theme } from "./styles/GlobalStyles";
import { Col, Button, Row, Card } from "antd";
import React, { useEffect, useState } from "react";
import Action, { doLogout } from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import { useAppState } from "./shared/AppProvider";
import CardNews from "./news/cardNews";
import { StringLink } from "../helper/string_link_helper";
import { useDispatch, useSelector } from "react-redux";
import { getInfoAction } from "../redux/actions/info.action";
import StatCard from "./shared/StatCard";
const Overview = () => {
  const dispatch = useDispatch();

  const [objUser, setObjUser] = useState({});
  const [isData, setIsData] = useState(false);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();
  const { loading, data } = useSelector((state) => state.infoReducer);

  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    const user = Action.getUser();
    if (user === undefined) {
      Router.push("/signin");
      doLogout();
    } else {
      setObjUser(user);
    }
  }, [isData, state]);
  useEffect(() => {
    dispatch(getInfoAction());
  }, []);
  useEffect(() => {
    if (!loading) {
      Action.setInfo(data);
    }
  }, [loading]);

  const arrBtn = [
    { title: "Register", link: StringLink.tambahMitra },
    { title: "Daftar Stokis", link: StringLink.stockis },
    { title: "Genealogy", link: StringLink.genealogy },
    { title: "Laporan", link: StringLink.reportTransaction },
    // { title: "Laporan Transaksi", link: StringLink.reportTransaction },
  ];

  return (
    <div>
      <Row className="mb-2">
        <Col xs={24} sm={24} md={24}>
          <Button
            type="dashed"
            danger
            style={{
              whiteSpace: "normal",
              height: "auto",
              width: "100%",
            }}
          >
            PERHATIAN !!
            <br /> Mohon maaf,Konten lainnya masih dalam tahap pengembangan
          </Button>
        </Col>
      </Row>
      <Row gutter={4}>
        <Col xs={24} sm={24} md={24} className="mb-2">
          <Card title="Kirimkan Link Referral Anda">
            <Button
              type="primary"
              icon={<CopyOutlined />}
              style={{
                whiteSpace: "normal",
                height: "auto",
                width: "100%",
              }}
              block={true}
              onClick={async (e) => Helper.copyText(objUser.referral_url)}
            >
              {objUser && objUser.referral_url}
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} className="mb-2">
          <StatCard
            type=""
            title="Total Downline"
            value={`${Helper.toRp(
              parseFloat(data.jumlah_downline).toFixed(0),
              true
            )} Orang`}
            icon={<ApartmentOutlined style={{ fontSize: "20px" }} />}
            color={theme.primaryColor}
          />
        </Col>
        <Col xs={24} sm={12} md={8} className="mb-2">
          <StatCard
            type=""
            title="Total Saldo"
            value={Helper.toRp(parseFloat(data.saldo).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.darkColor}
          />
        </Col>
        <Col xs={24} sm={12} md={8} className="mb-2">
          <StatCard
            type=""
            title="Total Penarikan"
            value={Helper.toRp(parseFloat(data.total_penarikan).toFixed(0))}
            icon={<WalletOutlined style={{ fontSize: "20px" }} />}
            color={theme.warningColor}
          />
        </Col>
        {/* <Col xs={24} sm={24} md={24} className="mb-2">
          <Card title="Shorcut Menu">
            <Row gutter={4}>
              {arrBtn.map((v, i) => {
                return (
                  <Col xs={12} sm={8} md={4} className="mb-2" key={i}>
                    <Button
                      type="primary"
                      style={{
                        whiteSpace: "normal",
                        height: "auto",
                        width: "100%",
                      }}
                      onClick={async (e) => {
                        Router.push(v.link);
                      }}
                    >
                      {v.title}
                    </Button>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col> */}
      </Row>

      {isData && (
        <Row>
          <Col xs={24} md={24} sm={24}>
            <p
              align="right"
              style={{ cursor: "pointer" }}
              onClick={() => Router.push(`/news`)}
            >
              <a>
                Lihat Semua <RightCircleOutlined />
              </a>
            </p>
          </Col>
        </Row>
      )}

      <Row gutter={16} type="flex">
        <CardNews
          callback={(res) => {
            setIsData(res.data.length > 0);
          }}
          isLoadMore={false}
          pagePer={4}
        />
      </Row>
    </div>
  );
};

export default Overview;
