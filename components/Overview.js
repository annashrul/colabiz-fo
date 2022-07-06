import { RightCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { Col, Button, Row, Card } from "antd";
import React, { useEffect, useState } from "react";
import Action, { doLogout } from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import { useAppState } from "./shared/AppProvider";
import CardNews from "./news/cardNews";
import { StringLink } from "../helper/string_link_helper";

const Overview = () => {
  const [objUser, setObjUser] = useState({});
  const [isData, setIsData] = useState(false);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();

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

  const arrBtn = [
    { title: "Register", link: StringLink.tambahMitra },
    { title: "Daftar Stokis", link: StringLink.stockis },
    // { title: "Laporan Transaksi", link: StringLink.reportTransaction },
  ];

  return (
    <div>
      <Row gutter={4}>
        <Col xs={24} sm={8} md={8} className="mb-2">
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
        </Col>
        {arrBtn.map((v, i) => {
          return (
            <Col xs={12} sm={8} md={8} className="mb-2" key={i}>
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
      <Row>
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
