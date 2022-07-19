import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import moment from "moment";
import authAction from "../../action/auth.action";
import Index from "../../components/genealogy/Index";
import Matahari from "../../components/genealogy/matahari";
import { Tabs, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getGenealogyAction } from "../../redux/actions/member.action";
moment.locale("id");

import { ExclamationCircleOutlined } from "@ant-design/icons";
import { aktivasiPinAction } from "../../redux/actions/info.action";
const { confirm } = Modal;

const Genealogy = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = authAction.getUser();
  const { loadingGenealogy, dataGenealogy } = useSelector(
    (state) => state.authUserReducer.loadingLogin
  );

  const getGenealogy = async (where) => {
    setData([
      {
        hasChild: parseInt(user.jumlah_downline, 10) > 0,
        id: user.referral,
        join_date: user.created_at,
        name: user.fullname,
        parentId: null,
        picture: user.foto,
        isActive: false,
        key: "0",
        status: user.status,
        activate: user.activate,
        id_member: user.id,
      },
    ]);
    setLoading(false);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(loadingGenealogy);
    getGenealogy(`${user.referral}?isfirst=true`);
  }, []);
  const onChange = async (val, keys) => {
    setLoading(true);
    await handleGet("member/genealogy/" + val, (res, status) => {
      if (res.data.length > 0) {
        res.data.map((row, index) => {
          Object.assign(row, {
            isActive: false,
          });
        });

        data.map((row, index) => {
          if (row.id === val) {
            Object.assign(row, { isActive: true });
          }
        });

        setData(data.concat(res.data));
      }
      setLoading(false);
    });
  };
  const handleActivate = (id_member, index) => {
    confirm({
      visible: true,
      title: "Informasi",
      icon: <ExclamationCircleOutlined />,
      okText: "Oke, Lanjut",
      okType: "danger",
      cancelText: "Kembali",
      content: "Anda yakin akan melakukan proses ini ?",
      onOk() {
        console.log(id_member);
        dispatch(
          aktivasiPinAction(
            {
              id_member: id_member,
            },
            () => {
              onChange(id_member, index);
            }
          )
        );
      },
    });
  };

  return arrayToTree(data.length > 0 ? data : [], {
    dataField: null,
    childrenField: "children",
  }).map((res, index) => {
    return (
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
          onChange(val, index);
        }}
        status={res.status}
        activate={res.activate}
        id_member={res.id_member}
        handleActive={(id_member, key) => handleActivate(id_member, index)}
      />
    );
  });

  // return (
  //   <Tabs defaultActiveKey="1" onChange={(e) => setStep(parseInt(e, 10))}>
  //     <TabPane tab="Satu Arah" key="1">
  //       {arrayToTree(data.length > 0 ? data : [], {
  //         dataField: null,
  //         childrenField: "children",
  //       }).map((res, index) => {
  //         return (
  //           <Index
  //             key={index}
  //             isActive={res.isActive}
  //             loading={loading}
  //             joinDate={res.join_date}
  //             picture={res.picture}
  //             id={res.id}
  //             name={`${res.name}`}
  //             children={res.children}
  //             callback={(val, keys) => {
  //               onChange(val, index);
  //             }}
  //           />
  //         );
  //       })}
  //     </TabPane>
  //     <TabPane tab="Matahari" key="2">
  //       {arrayToTree(data.length > 0 ? data : [], {
  //         dataField: null,
  //         childrenField: "children",
  //       }).map((res, index) => {
  //         return (
  //           <Matahari
  //             key={index}
  //             isActive={res.isActive}
  //             loading={loading}
  //             joinDate={res.join_date}
  //             picture={res.picture}
  //             id={res.id}
  //             name={`${res.name}`}
  //             children={res.children}
  //             callback={(val, keys) => {
  //               onChange(val, index);
  //             }}
  //           />
  //         );
  //       })}
  //     </TabPane>
  //   </Tabs>
  // );
};

export default Genealogy;
