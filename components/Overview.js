import {
  RightCircleOutlined,
  CopyOutlined,
  WalletOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { theme } from "./styles/GlobalStyles";
import { Col, Button, Row, Card, Popconfirm, Divider, Alert } from "antd";
import React, { useEffect, useState } from "react";
import Action, { doLogout } from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import { useAppState } from "./shared/AppProvider";
import CardNews from "./news/cardNews";
import { useDispatch, useSelector } from "react-redux";
import { aktivasiPinAction, getInfoAction } from "../redux/actions/info.action";
import StatCard from "./shared/StatCard";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import general_helper from "../helper/general_helper";
import { info } from "logrocket";
const Overview = () => {
  const dispatch = useDispatch();

  const [objUser, setObjUser] = useState({});
  const [isData, setIsData] = useState(false);
  const [visibleAktivasi, setVisibleAktivasi] = useState(false);
  const [state] = useAppState();
  const { loading, data, loadingPinAktivasi } = useSelector(
    (state) => state.infoReducer
  );

  useEffect(() => {
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

  console.log("info", data);
  console.log("user", objUser);

  let isDisableButton = false;
  if (data !== undefined) {
    if (parseInt(data.total_pin_aktivasi, 10) === 0 || data.activate === 1) {
      isDisableButton = true;
    }
  }

  return (
    <div>
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

        <Col md={16}>
          <Row>
            <Col xs={24} sm={12} md={24} className="mb-2">
              <StatCard
                title="Total Downline"
                value={`${Helper.toRp(
                  parseFloat(
                    data === undefined ? 0 : data.jumlah_downline
                  ).toFixed(0),
                  true
                )} Orang`}
                icon={<ApartmentOutlined style={{ fontSize: "20px" }} />}
                color={theme.primaryColor}
              />
            </Col>
            <Col xs={24} sm={12} md={24} className="mb-2">
              <StatCard
                title="Total Saldo"
                value={Helper.toRp(
                  parseFloat(data === undefined ? 0 : data.saldo).toFixed(0)
                )}
                icon={<WalletOutlined style={{ fontSize: "20px" }} />}
                color={theme.darkColor}
              />
            </Col>
            <Col xs={24} sm={12} md={24} className="mb-2">
              <StatCard
                title="Total Penarikan"
                value={Helper.toRp(
                  parseFloat(
                    data === undefined ? 0 : data.total_penarikan
                  ).toFixed(0)
                )}
                icon={<WalletOutlined style={{ fontSize: "20px" }} />}
                color={theme.warningColor}
              />
            </Col>
          </Row>
        </Col>
        <Col md={8}>
          <Row>
            <Col xs={24} sm={12} md={24} className="mb-2">
              <Card title={"Pin Yang Anda Miliki"}>
                {data && data.activate === 1 && (
                  <Alert banner type="success" message="Telah Di Aktivasi" />
                )}
                <Divider orientation="left" orientationMargin="0">
                  Aktivasi :{" "}
                  {data === undefined
                    ? 0
                    : general_helper.toRp(data.total_pin_aktivasi, true)}{" "}
                  PIN
                </Divider>

                {isDisableButton ? (
                  <Button
                    disabled={true}
                    type="primary"
                    style={{
                      width: "100%",
                    }}
                  >
                    Aktivasi
                  </Button>
                ) : (
                  <Popconfirm
                    visible={visibleAktivasi}
                    title="Kamu yakin akan melanjutkan proses ini ?"
                    onConfirm={(e) =>
                      dispatch(
                        aktivasiPinAction({
                          id_member: objUser.id,
                          id_stockis: data.id_stockis,
                        })
                      )
                    }
                    onCancel={(e) => setVisibleAktivasi(false)}
                    okText="Lanjut"
                    cancelText="Batal"
                    okButtonProps={{
                      loading: loadingPinAktivasi,
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        if (data.activate !== 1) setVisibleAktivasi(true);
                      }}
                      type="primary"
                      style={{
                        width: "100%",
                      }}
                    >
                      Aktivasi
                    </Button>
                  </Popconfirm>
                )}

                <Divider orientation="left" orientationMargin="0">
                  Happy Shopping :{" "}
                  {data === undefined ? 0 : general_helper.toRp(0, true)} PIN
                </Divider>
                <Button
                  disabled
                  type="primary"
                  style={{
                    width: "100%",
                  }}
                >
                  Aktivasi Happy Shopping
                </Button>
                <Divider orientation="left" orientationMargin="0">
                  Smart Contract :{" "}
                  {data === undefined ? 0 : general_helper.toRp(0, true)} PIN
                </Divider>
                <Button disabled type="primary" style={{ width: "100%" }}>
                  Aktivasi Smart Contract
                </Button>
              </Card>
            </Col>
          </Row>
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
