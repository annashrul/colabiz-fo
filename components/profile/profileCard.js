import { Avatar, Button, Card, Col, Row, Tooltip } from "antd";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { CopyOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
import moment from "moment";
import { getInfoAction } from "../../redux/actions/info.action";
import { useDispatch, useSelector } from "react-redux";

moment.locale("id");
const ProfileCard = ({ callback }) => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const { loading, data, loadingPinAktivasi, loadingHappyShopping } =
    useSelector((state) => state.infoReducer);
  useEffect(() => {
    const users = authAction.getUser();
    setUser(users);
  }, [state, showForm]);

  const tempRow = (title, desc) => {
    return (
      <Row>
        <Col xs={10} md={10} style={{ alignItems: "left", textAlign: "left" }}>
          {title}
        </Col>
        <Col
          xs={14}
          md={14}
          style={{
            alignItems: state.mobile ? "right" : "left",
            textAlign: state.mobile ? "right" : "left",
          }}
        >
          {!state.mobile && ":"} {desc}
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
        className="mb-2 overflow-hidden w-100"
        title={
          <Row type="flex" align="middle">
            <Avatar size={40} src={user.foto}>
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
                onClick={async () =>
                  general_helper.copyText(user.referral_url, "Link referral")
                }
              >
                <span>{user.referral}</span> &nbsp;
                <Tooltip title="copy link referral">
                  <CopyOutlined style={{ marginLeft: "1px" }} />
                </Tooltip>
              </small>
            </div>
          </Row>
        }
        extra={
          callback && (
            <Row
              style={{ display: !state.mobile ? "block" : "none" }}
              type="flex"
              align="middle"
              className="p-4"
            >
              <Button type="primary" onClick={callback}>
                Ubah Profile
              </Button>
            </Row>
          )
        }
      >
        {tempRow("Username", user.uid)}
        <Row>
          <Col style={{ margin: "1px" }}></Col>
        </Row>
        {tempRow("Email", user.email)}
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
        {callback && state.mobile && (
          <div>
            <Button
              style={{ width: "100%", marginTop: "10px" }}
              type="primary"
              onClick={callback}
            >
              Ubah Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfileCard;
