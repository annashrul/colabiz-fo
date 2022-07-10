import {
  Collapse,
  Spin,
  Message,
  Image,
  Row,
  Col,
  Avatar,
  Empty,
  Tree,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";

moment.locale("id");
const { Panel } = Collapse;

const Matahari = ({
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
    <Avatar
      src={
        <Image
          src="https://joeschmoe.io/api/v1/random"
          style={{
            width: 32,
          }}
        />
      }
    />
  );
};

export default Matahari;
