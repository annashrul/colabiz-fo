import {
  Collapse,
  Message,
  Badge,
  Row,
  Col,
  Tag,
  Avatar,
  Empty,
  Space,
  Card,
  Button,
  Modal,
  message,
} from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import general_helper from "../../helper/general_helper";
import {
  CheckCircleOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  aktivasiPinAction,
  getConfigAction,
} from "../../redux/actions/info.action";
import { useDispatch, useSelector } from "react-redux";
moment.locale("id");
const { Panel } = Collapse;
const { confirm } = Modal;

const Index = ({
  no,
  isActive,
  loading,
  joinDate,
  picture,
  id,
  name,
  children = [],
  callback,
  status,
  activate,
  id_member,
  handleActive,
  totalPinAktivasi,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConfigAction());
  }, []);
  const { loadingConfig, dataConfig } = useSelector(
    (state) => state.infoReducer
  );
  const handleMore = (idData, index) => {
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData, index);
    }
  };

  return (
    <Collapse
      // key={no}
      bordered={false}
      style={{
        boxShadow: "none",
        borderLeft: "1px solid green",
        borderBottom: "none",
        marginBottom: "10px",
      }}
      onChange={(keys) => {
        if (!isActive) {
          handleMore(id, no);
        }
      }}
      expandIconPosition="right"
      // defaultActiveKey={"1"}
    >
      <Panel
        // key={`${no + 1}`}
        header={
          <Badge.Ribbon
            color={parseInt(activate, 10) === 0 ? "#f50" : "#87d068"}
            text={
              <small>
                {parseInt(activate, 10) === 0 ? (
                  <SyncOutlined spin />
                ) : (
                  <CheckCircleOutlined />
                )}
                &nbsp;
                {parseInt(activate, 10) === 0
                  ? "Belum Aktivasi"
                  : "Telah Aktivasi"}
              </small>
            }
          >
            <Card
              title={
                <Row>
                  <Col>
                    <Avatar src={picture} size={30}>
                      {general_helper.getInitialName(name)}
                    </Avatar>
                  </Col>
                  <Col style={{ marginLeft: "5px" }}>
                    <Row>
                      <small>
                        {id} - ({name})
                      </small>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <small>
                          <Badge
                            style={{
                              color:
                                parseInt(status, 10) === 0 ? "#f50" : "#87d068",
                            }}
                            status={
                              parseInt(status, 10) === 0
                                ? "processing"
                                : "green"
                            }
                            text={
                              <small>
                                {parseInt(status, 10) === 0
                                  ? "Belum Terverifikasi"
                                  : "Sudah Terverifikasi"}
                              </small>
                            }
                          />
                        </small>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              }
              size="small"
            >
              {parseInt(activate, 10) === 0 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <p style={{ float: "right" }}>
                      <Button
                        htmlType="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (parseInt(dataConfig.total_pin_aktivasi, 10) > 0) {
                            handleActive(id_member, no);
                          } else {
                            message.info("pin aktivasi anda sudah habis");
                          }
                        }}
                        size="small"
                      >
                        Aktivasi
                      </Button>
                    </p>
                  </Col>
                </Row>
              )}
            </Card>
          </Badge.Ribbon>
        }
      >
        {children.length > 0
          ? children.map((res, index) => {
              return (
                <span key={index}>
                  <Index
                    key={index}
                    no={res.no}
                    isActive={res.isActive}
                    loading={loading}
                    joinDate={res.join_date}
                    picture={res.picture}
                    id={res.id}
                    name={`${res.name}`}
                    children={res.children}
                    callback={(val, keys) => {
                      handleMore(val, index);
                    }}
                    status={res.status}
                    activate={res.activate}
                    id_member={res.id_member}
                    handleActive={(id_member, index) =>
                      handleActive(id_member, index)
                    }
                    totalPinAktivasi={totalPinAktivasi}
                  />
                </span>
              );
            })
          : ""}
      </Panel>
    </Collapse>
  );
};

export default Index;
