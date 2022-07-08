import { Collapse, Spin, Message, Row, Col, Avatar, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import listToTree from "list-to-tree-lite";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getGenealogyAction } from "../../redux/actions/member.action";
import authAction from "../../action/auth.action";
import general_helper from "../../helper/general_helper";

moment.locale("id");
const { Panel } = Collapse;

const Index = ({
  loading,
  joinDate,
  picture,
  id,
  name,
  children = [],
  callback,
}) => {
  const handleMore = (idData) => {
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData);
    }
    // addToast(idData, {appearance: 'warning',autoDismiss: true});
  };

  return (
    <Collapse
      onChange={(key) => {
        handleMore(id);
      }}
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
          ? children.map((res, key) => {
              return (
                <Index
                  key={key}
                  {...res}
                  loading={loading}
                  joinDate={res.join_date}
                  picture={res.picture}
                  id={res.id}
                  name={res.name}
                  children={res.children}
                  callback={(val) => handleMore(val)}
                />
              );
            })
          : !loading && <Empty />}
      </Panel>
    </Collapse>
  );
};

export default Index;
