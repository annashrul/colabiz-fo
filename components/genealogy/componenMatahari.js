import { Empty, Message, Tag } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
// import ReactFamilyTree from "react-family-tree";
// import FamilyNode from "./your-components/FamilyNode";

moment.locale("id");

const ComponentMatahari = ({
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
  const handleMore = (idData, index) => {
    if (children.length === 0) Message.info(`${name} belum mempunyai downline`);
    else {
      callback(idData, index);
    }
  };
  return (
    <>
      <li key={no}>
        <a
          onClick={(e) => {
            handleMore(id, no);
          }}
        >
          <div className="container-genealogy">
            <div className="w-16">
              <img className="imgs" alt="name" src={picture} />
            </div>
            <div className="row" style={{ marginTop: "5px" }}>
              <i className="fa fa-exclamation-circle fa-2x"></i>
            </div>
            <div className="row">{name}</div>
            <div className="row" style={{ marginBottom: "5px" }}>
              <p>
                <Tag color={status === 0 ? "#f50" : "#87d068"}>
                  {status === 0 ? "Belum Terverifikasi" : "Sudah Terverifikasi"}
                </Tag>
              </p>
              <p className="mt-2">
                <Tag color={activate === 0 ? "#f50" : "#87d068"}>
                  {activate === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
                </Tag>
              </p>
            </div>
          </div>
        </a>
      </li>
      {children.length > 0 &&
        children.map((res, index) => {
          <ComponentMatahari
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
            handleActive={(id_member, index) => handleActive(id_member, index)}
            totalPinAktivasi={totalPinAktivasi}
          />;
        })}
    </>
  );
};

export default ComponentMatahari;
