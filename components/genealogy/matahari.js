import { Badge, Empty, Message } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import ComponentMatahari from "./componenMatahari";
// import ReactFamilyTree from "react-family-tree";
// import FamilyNode from "./your-components/FamilyNode";

moment.locale("id");

const Matahari = ({
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
  hasChild,
}) => {
  const handleMore = (idData, name) => {
    // if (idData === null) Message.success("data tidak ada");
    // else {
    //   callback(idData, index);
    // }
    callback(idData, name);
  };
  return (
    <>
      <a
        href="#"
        onClick={(e) => {
          if (!isActive) {
            handleMore(id, name);
          }
        }}
      >
        <div className="container-genealogy">
          <div className="w-16">
            <img className="imgs" alt="name" src={picture} />
          </div>
          <div className="row" style={{ marginTop: "5px" }}>
            <i className="fa fa-exclamation-circle fa-2x"></i>
          </div>
          <div className="row"> {name}</div>
          <div className="row" style={{ marginBottom: "5px" }}>
            {activate === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
          </div>
        </div>
      </a>
      {children.length > 0 && (
        <ul>
          {children.map((res, index) => {
            return (
              <li key={index}>
                <Matahari
                  no={res.no}
                  isActive={res.isActive}
                  loading={false}
                  joinDate={res.join_date}
                  picture={res.picture}
                  id={res.id}
                  name={`${res.name}`}
                  children={res.children}
                  callback={(val, keys) => {
                    console.log(res);
                    handleMore(val, res.name);
                  }}
                  status={res.status}
                  activate={res.activate}
                  id_member={res.id_member}
                  handleActive={(id_member, key) => {
                    // if (parseInt(dataConfig.total_pin_aktivasi, 10) === 0) {
                    //   handleActivate(id_member, index);
                    // }
                  }}
                  totalPinAktivasi={res.totalPinAktivasi}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
  return (
    children.length > 0 &&
    children.map((res, index) => {
      return (
        <li>
          <a
            href="#"
            onClick={(e) => {
              handleMore(res.id, res.no);
            }}
          >
            <div className="container-genealogy">
              <div className="w-16">
                <img className="imgs" alt="name" src={res.picture} />
              </div>
              <div className="row" style={{ marginTop: "5px" }}>
                <i className="fa fa-exclamation-circle fa-2x"></i>
              </div>
              <div className="row">
                {" "}
                {res.name} {res.hasChild ? "true" : "false"}
              </div>
              <div className="row" style={{ marginBottom: "5px" }}>
                {res.activate === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
              </div>
            </div>
          </a>
        </li>
      );
    })
  );
  return (
    <div style={{ marginTop: "20px", zoom: "80%" }}>
      <div className="row">
        <div className="col-md-12">
          <div
            className="tree"
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    if (!isActive) {
                      handleMore(id, no);
                    }
                  }}
                >
                  <div className="container-genealogy">
                    <div className="w-16">
                      <img className="imgs" alt="name" src={picture} />
                    </div>
                    <div className="row" style={{ marginTop: "5px" }}>
                      <i className="fa fa-exclamation-circle fa-2x"></i>
                    </div>
                    <div className="row"> {name} </div>
                    <div className="row" style={{ marginBottom: "5px" }}>
                      {activate === 0 ? "Belum Aktivasi" : "Telah Aktivasi"}
                    </div>
                  </div>
                </a>
                <ul>
                  {children.length > 0 &&
                    children.map((res, index) => {
                      return (
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              handleMore(id, no);
                            }}
                          >
                            <div className="container-genealogy">
                              <div className="w-16">
                                <img
                                  className="imgs"
                                  alt="name"
                                  src={picture}
                                />
                              </div>
                              <div className="row" style={{ marginTop: "5px" }}>
                                <i className="fa fa-exclamation-circle fa-2x"></i>
                              </div>
                              <div className="row"> {name} </div>
                              <div
                                className="row"
                                style={{ marginBottom: "5px" }}
                              >
                                {activate === 0
                                  ? "Belum Aktivasi"
                                  : "Telah Aktivasi"}
                              </div>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                </ul>
                {/* <ul>
                  
                  {children.length > 0 &&
                    children.map((res, index) => {
                      return (
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
                          handleActive={(id_member, index) =>
                            handleActive(id_member, index)
                          }
                          totalPinAktivasi={totalPinAktivasi}
                        />
                      );
                    })}
                </ul> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matahari;
