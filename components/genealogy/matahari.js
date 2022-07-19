import { Empty, Message } from "antd";
import React from "react";
import moment from "moment";
import ComponentMatahari from "./componenMatahari";
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
  status,
  activate,
  id_member,
  handleActive,
  totalPinAktivasi,
}) => {
  const handleMore = (idData, index) => {
    if (idData === null) Message.success("data tidak ada");
    else {
      callback(idData, index);
    }
  };

  return (
    <div style={{ marginTop: "20px", zoom: "80%" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="tree">
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    if (!isActive) {
                      handleMore(id, key);
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
                        <ComponentMatahari
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
                          totalPinAktivasi={totalPinAktivasi}
                        />
                      );
                    })}
                  {/* <li>
                    <a href="#">
                      <div className="container-genealogy">
                        <div className="w-16">
                          <img
                            className="imgs"
                            alt="name"
                            src="https://dummyimage.com/302x302/94a3b8/ffffff"
                          />
                        </div>
                        <div className="row" style={{ marginTop: "5px" }}>
                          <i className="fa fa-exclamation-circle fa-2x"></i>
                        </div>
                        <div className="row"> Tatang Herb </div>
                        <div className="row" style={{ marginBottom: "5px" }}>
                          Qualified
                        </div>
                      </div>
                    </a>
                  </li> */}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matahari;
