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
} from "antd";
import React from "react";
import moment from "moment";
import general_helper from "../../helper/general_helper";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
moment.locale("id");
const { Panel } = Collapse;

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
}) => {
  const handleMore = (idData, index) => {
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData, index);
    }
  };

  console.log(activate);
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
            color={status === 0 ? "#f50" : "#87d068"}
            text={
              <small>
                {status === 0 ? <SyncOutlined spin /> : <CheckCircleOutlined />}
                &nbsp;
                {status === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
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
                      <small>
                        <Badge
                          style={{
                            color: activate === 0 ? "#f50" : "#87d068",
                          }}
                          status={activate === 0 ? "processing" : "green"}
                          text={
                            <small>
                              {activate === 0
                                ? "Belum Terverifikasi"
                                : "Sudah Terverifikasi"}
                            </small>
                          }
                        />
                      </small>
                    </Row>
                  </Col>
                </Row>
              }
              size="small"
            >
              <Row>
                <Col md={12}>
                  {activate === 0
                    ? "Belum Terverifikasi"
                    : "Sudah Terverifikasi"}
                </Col>
                {activate === 0 && (
                  <Col md={12}>
                    <p style={{ float: "right" }}>
                      <Button
                        htmlType="button"
                        onClick={(e) => {
                          e.preventDefault();
                          return;
                        }}
                        size="small"
                      >
                        Aktivasi
                      </Button>
                    </p>
                  </Col>
                )}
              </Row>
            </Card>
          </Badge.Ribbon>
          // <Badge.Ribbon
          //   placement="start"
          //   color={status === 0 ? "#f50" : "#87d068"}
          //   text={
          //     <Space>
          // <small>
          //   {status === 0 ? (
          //     <SyncOutlined spin />
          //   ) : (
          //     <CheckCircleOutlined />
          //   )}
          //   &nbsp;
          //   {status === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
          // </small>
          //       {/* {activate === 0 && <Tag>Aktivasi</Tag>} */}
          //     </Space>
          //   }
          // >
          //   <p style={{ float: "right" }}>ads</p>
          //   <Row type="flex" style={{ alignItems: "center" }}>
          //     <Col>
          // <Avatar src={picture}>
          //   {general_helper.getInitialName(name)}
          // </Avatar>
          //     </Col>
          // <Col style={{ marginLeft: "5px" }}>
          //   <Row>
          //     <small>{name}</small>
          //   </Row>
          //   <Row>
          //     <small>
          //       <Badge
          // style={{
          //   color: activate === 0 ? "#f50" : "#87d068",
          // }}
          // status={activate === 0 ? "processing" : "green"}
          //         text={
          //           <small>
          // {activate === 0
          //   ? "Belum Terverifikasi"
          //   : "Sudah Terverifikasi"}
          //           </small>
          //         }
          //       />
          //     </small>
          //   </Row>
          // </Col>
          //   </Row>
          // </Badge.Ribbon>
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
