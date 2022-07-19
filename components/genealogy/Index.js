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
} from "antd";
import React from "react";
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
import { aktivasiPinAction } from "../../redux/actions/info.action";
import { useDispatch } from "react-redux";
moment.locale("id");
const { Panel } = Collapse;
const { confirm } = Modal;

const Index = ({
  key,
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
}) => {
  const dispatch = useDispatch();
  const handleMore = (idData, index) => {
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData, index);
    }
  };

  return (
    <Collapse
      bordered={false}
      style={{
        boxShadow: "none",
        borderLeft: "1px solid green",
        borderBottom: "none",
        marginBottom: "10px",
      }}
      onChange={(keys) => {
        if (!isActive) {
          handleMore(id, key);
        }
      }}
      expandIconPosition="right"
    >
      <Panel
        header={
          <Badge.Ribbon
            color={activate === 0 ? "#f50" : "#87d068"}
            text={
              <small>
                {activate === 0 ? (
                  <SyncOutlined spin />
                ) : (
                  <CheckCircleOutlined />
                )}
                &nbsp;
                {activate === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
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
                      <small>{name}</small>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <small>
                          <Badge
                            style={{
                              color: status === 0 ? "#f50" : "#87d068",
                            }}
                            status={status === 0 ? "processing" : "green"}
                            text={
                              <small>
                                {status === 0
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
              {activate === 0 && (
                <Row>
                  <Col md={24} xs={24} sm={24}>
                    <p style={{ float: "right" }}>
                      <Button
                        htmlType="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActive(id_member, key);
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
                  />
                </span>
              );
            })
          : !loading && (
              <Empty description={`${name} belum mempunyai downline`} />
            )}
      </Panel>
    </Collapse>
  );
};

export default Index;
