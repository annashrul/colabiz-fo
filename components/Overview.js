import {
  RightCircleOutlined,
  WalletOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { theme } from "./styles/GlobalStyles";
import { Col, Button, Row, Card, Popconfirm, Alert, Badge } from "antd";
import React, { useEffect, useState } from "react";
import Action, { doLogout } from "../action/auth.action";
import Helper from "../helper/general_helper";
import Router from "next/router";
import { useAppState } from "./shared/AppProvider";
import CardNews from "./news/cardNews";
import { useDispatch, useSelector } from "react-redux";
import {
  aktivasiPinAction,
  getInfoAction,
  happyShoppingPinAction,
} from "../redux/actions/info.action";
import StatCard from "./shared/StatCard";
import general_helper from "../helper/general_helper";
import moment from "moment";
import ProfileCard from "./profile/profileCard";
import BonusComponent from "./dashboard/BonusComponent";
moment.locale("id");

const Overview = () => {
  const dispatch = useDispatch();
  const [objUser, setObjUser] = useState({});
  const [isData, setIsData] = useState(false);
  const [visibleAktivasi, setVisibleAktivasi] = useState(false);
  const [visibleHs, setVisibleHs] = useState(false);
  const [state] = useAppState();
  const { loading, data, loadingPinAktivasi, loadingHappyShopping } =
    useSelector((state) => state.infoReducer);
  useEffect(() => {
    const user = Action.getUser();
    if (user !== undefined) {
      setObjUser(user);
    } else {
      doLogout();
      Router.push("/signin");
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

  let isDisableButton = false;
  let isDisableButtonHs = false;
  if (data !== undefined) {
    if (parseInt(data.total_pin_aktivasi, 10) === 0 || data.activate === 1) {
      isDisableButton = true;
    }
    if (!data.status_hs) {
      isDisableButtonHs = true;
    }
  }

  const tempAktivasi = () => {
    return (
      <Card
        title={"Pin Anda"}
        headStyle={{
          backgroundColor: "#fffbe6",
          color: "#d48806",
          border: "1px solid #ffe58f",
        }}
        bodyStyle={{
          backgroundColor: "#fffbe6",
          color: "#d48806",
          border: "1px solid #ffe58f",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          AKTIVASI :{" "}
          {data === undefined
            ? 0
            : general_helper.toRp(data.total_pin_aktivasi, true)}{" "}
          PIN
        </p>

        {isDisableButton ? (
          <Badge.Ribbon text={<CloseCircleOutlined />} color="red">
            <Button
              size="medium"
              disabled={true}
              type="primary"
              style={{
                color: "#d48806",
                borderColor: "#d48806",
                backgroundColor: "#fffbe6",
                width: "100%",
              }}
            >
              Aktivasi
            </Button>
          </Badge.Ribbon>
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
            <Badge.Ribbon text={<CheckCircleOutlined />} color="green">
              <Button
                size="medium"
                type="primary"
                style={{
                  color: "#d48806",
                  borderColor: "#d48806",
                  backgroundColor: "#fffbe6",
                  width: "100%",
                }}
                onClick={(e) => {
                  if (data.activate !== 1) setVisibleAktivasi(true);
                }}
              >
                Aktivasi
              </Button>
            </Badge.Ribbon>
          </Popconfirm>
        )}

        <p style={{ marginTop: "10px", marginBottom: "10px" }}>
          HAPPY SHOPPING :{" "}
          {data === undefined
            ? 0
            : general_helper.toRp(data.total_pin_hs, true)}{" "}
          PIN
        </p>
        {isDisableButtonHs ? (
          <Badge.Ribbon text={<CloseCircleOutlined />} color="red">
            <Button
              size="medium"
              disabled={true}
              type="primary"
              style={{
                color: "#d48806",
                borderColor: "#d48806",
                backgroundColor: "#fffbe6",
                width: "100%",
              }}
            >
              Aktivasi
            </Button>
          </Badge.Ribbon>
        ) : (
          <Popconfirm
            visible={visibleHs}
            title="Kamu yakin akan melanjutkan proses ini ?"
            onConfirm={(e) =>
              dispatch(
                happyShoppingPinAction({
                  id_member: objUser.id,
                })
              )
            }
            onCancel={(e) => setVisibleHs(false)}
            okText="Lanjut"
            cancelText="Batal"
            okButtonProps={{
              loading: loadingHappyShopping,
            }}
          >
            <Badge.Ribbon text={<CheckCircleOutlined />} color="green">
              <Button
                size="medium"
                type="primary"
                style={{
                  color: "#d48806",
                  borderColor: "#d48806",
                  backgroundColor: "#fffbe6",
                  width: "100%",
                }}
                onClick={(e) => {
                  setVisibleHs(true);
                }}
              >
                Aktivasi
              </Button>
            </Badge.Ribbon>
          </Popconfirm>
        )}

        <p style={{ marginTop: "10px", marginBottom: "10px" }}>
          SMART CONTRACT :{" "}
          {data === undefined ? 0 : general_helper.toRp(0, true)} PIN
        </p>
        <Badge.Ribbon text={<CloseCircleOutlined />} color="red">
          <Button
            size="medium"
            disabled={true}
            type="primary"
            style={{
              color: "#d48806",
              borderColor: "#d48806",
              backgroundColor: "#fffbe6",
              width: "100%",
            }}
          >
            Aktivasi
          </Button>
        </Badge.Ribbon>

        {/* <Badge.Ribbon text="tidak aktif" color="orange">
          <Button
            size="medium"
            disabled={true}
            type="primary"
            style={{
              color: "#d48806",
              borderColor: "#d48806",
              backgroundColor: "#fffbe6",
              width: "100%",
            }}
          >
            Aktivasi
          </Button>
        </Badge.Ribbon> */}
        {/* <Button size="medium" disabled type="primary" style={{ width: "100%" }}>
          Aktivasi Smart Contract
        </Button> */}
      </Card>
    );
  };

  return (
    <div>
      <Row gutter={4}>
        <Col md={18}>
          <ProfileCard />
          <Row gutter={4}>
            <Col xs={24} sm={12} md={8} className="mb-2">
              <StatCard
                type={"fill"}
                title={<span>Direct Sponsor</span>}
                value={
                  <span>
                    {Helper.toRp(
                      parseFloat(
                        data === undefined ? 0 : data.jumlah_downline
                      ).toFixed(0),
                      true
                    )}{" "}
                    Orang
                  </span>
                }
                icon={<ApartmentOutlined style={{ fontSize: "20px" }} />}
                color={theme.primaryColor}
              />
            </Col>

            <Col xs={24} sm={12} md={8} className="mb-2">
              <StatCard
                type={"fill"}
                title="Total Saldo"
                value={Helper.toRp(
                  parseFloat(data === undefined ? 0 : data.saldo).toFixed(0)
                )}
                icon={<WalletOutlined style={{ fontSize: "20px" }} />}
                color={theme.darkColor}
              />
            </Col>
            <Col xs={24} sm={12} md={8} className="mb-2">
              <StatCard
                type={"fill"}
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
        <Col md={6} xs={24} sm={12}>
          <Row>
            <Col xs={24} sm={12} md={24}>
              {data && data.activate === 1 ? (
                <Badge.Ribbon
                  color={"green"}
                  size="small"
                  status="success"
                  text="Telah Diaktivasi"
                >
                  {tempAktivasi()}
                </Badge.Ribbon>
              ) : (
                tempAktivasi()
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      {data && <BonusComponent info={data} />}

      {/* {isData && (
        <Row>
          <Col xs={24} md={24} sm={24}>
            <p
              align="right"
              style={{ cursor: "pointer", marginTop: "10px" }}
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
            setIsData(res.length > 0);
          }}
          isLoadMore={false}
          pagePer={4}
        />
      </Row> */}
    </div>
  );
};

export default Overview;
