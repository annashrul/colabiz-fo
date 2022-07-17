import { Message } from "antd";
import React from "react";
import moment from "moment";
// import ReactFamilyTree from "react-family-tree";
// import FamilyNode from "./your-components/FamilyNode";

moment.locale("id");

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
  const WIDTH = 70;
  const HEIGHT = 80;

  return <p></p>;
};

export default Matahari;
