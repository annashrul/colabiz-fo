import { Avatar, Button, Divider, Card, Col, Row, Tooltip, Alert } from "antd";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { CopyOutlined, HomeOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
import FormComponent from "./formComponent";
import moment from "moment";
import { handleGet } from "../../action/baseAction";
import StatCard from "../shared/StatCard";
moment.locale("id");
const ProfileComponent = () => {
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [bank, setBank] = useState({});
  const [address, setAddress] = useState({});
  const [font, setFont] = useState("14px");
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    const users = authAction.getUser();
    const banks = authAction.getBank();
    const adresses = authAction.getAddress();
    setUser(users);
    setBank(banks);
    setAddress(adresses);
  }, [state, showForm]);

  const handleUser = async (isShow = false) => {
    await handleGet(`member/get/${user.id}`, (res, msg) => {
      const users = res.data;
      const userState = user;
      Object.assign(userState, users);
      setUser(userState);
      authAction.setUser(userState);
      isShow && setShowForm(false);
    });
  };

  console.log(authAction.getAddress());

  const tempRow = (title, desc, isRp = true) => {
    return (
      <Row>
        <Col xs={10} md={10} style={{ alignItems: "left", textAlign: "left" }}>
          <small style={{ fontSize: font }}>{title}</small>
        </Col>
        <Col
          xs={14}
          md={14}
          style={{
            alignItems: state.mobile ? "right" : "left",
            textAlign: state.mobile ? "right" : "left",
          }}
        >
          <small style={{ fontSize: font }}>
            {!state.mobile && ":"} {desc}
          </small>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Card
        headStyle={{
          backgroundImage: "url(/images/23.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
        bodyStyle={{ padding: 10 }}
        className="mb-4 overflow-hidden w-100"
        title={
          <Row type="flex" align="middle">
            <Avatar size={64} src={user.foto}>
              {user.fullname !== undefined &&
                general_helper.getInitialName(user.fullname)}
            </Avatar>
            <div
              className="px-2 text-light"
              css={`
                display: inline-block;
              `}
            >
              <h6 className="my-0 text-white">
                <span className="my-0">{user.fullname}</span>
              </h6>
              <small
                className="text-light text-white"
                style={{ cursor: "pointer", color: "white" }}
                onClick={async () => general_helper.copyText(user.referral_url)}
              >
                <span>{user.referral}</span> &nbsp;
                <Tooltip title="copy kode referral">
                  <CopyOutlined style={{ marginLeft: "1px" }} />
                </Tooltip>
              </small>
            </div>
          </Row>
        }
        extra={
          <Row
            style={{ display: !state.mobile ? "block" : "none" }}
            type="flex"
            align="middle"
            className="p-4"
          >
            <Button type="primary" onClick={() => setShowForm(!showForm)}>
              Ubah Profile
            </Button>
          </Row>
        }
      >
        {tempRow("Username", user.uid)}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {tempRow("No Telepon", user.mobile_no)}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>

        {tempRow("Tanggal Gabung", moment(user.created_at).format("LL"))}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {tempRow(
          "Sponsor",
          user.sponsor_referral !== null ? user.sponsor_referral : "-"
        )}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {state.mobile && (
          <div>
            <Button
              style={{ width: "100%", marginTop: "10px" }}
              type="primary"
              onClick={() => setShowForm(!showForm)}
            >
              Ubah Profile
            </Button>
          </div>
        )}
      </Card>
      <Row gutter={16}>
        <Col md={12}>
          <StatCard
            clickHandler={() => {}}
            value={bank.bank_name}
            title={`${bank.acc_name}, ${bank.acc_no}`}
            icon={
              <HomeOutlined
                style={{
                  fontSize: state.mobile ? "14px" : "20px",
                }}
              />
            }
          />
          <Alert
            banner
            message="klik atau sentuh untuk mengedit akun bank anda"
          />
        </Col>
        <Col md={12}>
          <StatCard
            clickHandler={() => {}}
            value={address.title}
            title={`${address.main_address}, ${address.kecamatan}, ${address.kota}, ${address.provinsi}`}
            icon={
              <HomeOutlined
                style={{
                  fontSize: state.mobile ? "14px" : "20px",
                }}
              />
            }
            // color={theme.darkColor}
          />
        </Col>
      </Row>

      <br />
      {showForm && (
        <FormComponent
          isModal={showForm}
          ok={() => {
            handleUser(true);
          }}
          cancel={() => {
            setShowForm(false);
          }}
          userData={user}
        />
      )}
    </div>
  );
};

export default ProfileComponent;
