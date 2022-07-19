import {
  RightCircleOutlined,
  WalletOutlined,
  ApartmentOutlined,
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
      <Card title={"Pin Anda"}>
        <p style={{ marginBottom: "10px" }}>
          Aktivasi :{" "}
          {data === undefined
            ? 0
            : general_helper.toRp(data.total_pin_aktivasi, true)}{" "}
          PIN
        </p>

        {isDisableButton ? (
          <Button
            size="medium"
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
              size="medium"
              type="primary"
              style={{
                width: "100%",
              }}
            >
              Aktivasi
            </Button>
          </Popconfirm>
        )}

        <p style={{ marginTop: "10px", marginBottom: "10px" }}>
          Happy Shopping :{" "}
          {data === undefined
            ? 0
            : general_helper.toRp(data.total_pin_hs, true)}{" "}
          PIN
        </p>
        {isDisableButtonHs ? (
          <Button
            size="medium"
            disabled={true}
            type="primary"
            style={{
              width: "100%",
            }}
          >
            Aktivasi Happy Shopping
          </Button>
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
            <Button
              onClick={(e) => {
                // if (data.activate !== 1) setVisibleHs(true);
                setVisibleHs(true);
              }}
              size="medium"
              type="primary"
              style={{
                width: "100%",
              }}
            >
              Aktivasi Happy Shopping
            </Button>
          </Popconfirm>
        )}

        <p style={{ marginTop: "10px", marginBottom: "10px" }}>
          Smart Contract :{" "}
          {data === undefined ? 0 : general_helper.toRp(0, true)} PIN
        </p>
        <Button size="medium" disabled type="primary" style={{ width: "100%" }}>
          Aktivasi Smart Contract
        </Button>
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
                title={<span>Total Downline</span>}
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

      {isData && (
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
      </Row>
    </div>
  );
};

export default Overview;
