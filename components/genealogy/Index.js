import { Collapse, Spin, Message, Row, Col, Avatar, Empty, Tree } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import general_helper from "../../helper/general_helper";

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
}) => {
  const handleMore = (idData, index) => {
    console.log(`key`, `${key}-${index}`);
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData, index);
    }
  };
  return (
    <Collapse
      bordered={false}
      style={{
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
          <Row type="flex" style={{ alignItems: "center" }}>
            <Col>
              <Avatar src={picture}>
                {general_helper.getInitialName(name)}
              </Avatar>
            </Col>
            <Col style={{ marginLeft: "5px" }}>
              <Row>
                <small>{name}</small>
              </Row>
              <Row>
                <small>{moment(joinDate).format("LLL")}</small>
              </Row>
            </Col>
          </Row>
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
