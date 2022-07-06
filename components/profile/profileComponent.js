import { Avatar, Button, Card, Col, Row, Tooltip } from "antd";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { CopyOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
import FormComponent from "./formComponent";
import moment from "moment";
import { handleGet } from "../../action/baseAction";
moment.locale("id");
const ProfileComponent = () => {
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [font, setFont] = useState("14px");
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
    const users = authAction.getUser();
    setUser(users);
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
          // backgroundImage: "url(/images/23.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
        bodyStyle={{ padding: 10 }}
        className="mb-4 overflow-hidden w-100"
        title={
          <Row type="flex" align="middle">
            <Avatar src={user.foto}>
              {" "}
              {user.fullname !== undefined &&
                general_helper.getInitialName(user.fullname)}
            </Avatar>
            <div
              className="px-2 text-light"
              css={`
                display: inline-block;
              `}
            >
              <h6 className="my-0">
                <span className="my-0">{user.fullname}</span>
              </h6>
              <small
                className="text-light"
                style={{ cursor: "pointer", color: "white" }}
                onClick={async () => general_helper.copyText(user.referral_url)}
              >
                <span style={{ color: "red" }}>{user.referral_url}</span> &nbsp;
                <Tooltip title="copy kode referral">
                  <CopyOutlined style={{ marginLeft: "1px", color: "red" }} />
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
            <Button type="dashed" danger onClick={() => setShowForm(!showForm)}>
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
              type="dashed"
              danger
              onClick={() => setShowForm(!showForm)}
            >
              Ubah Profile
            </Button>
          </div>
        )}
      </Card>

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
