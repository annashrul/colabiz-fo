import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import moment from "moment";
import authAction from "../../action/auth.action";
import Index from "../../components/genealogy/Index";
import Matahari from "../../components/genealogy/matahari";

moment.locale("id");

const Genealogy = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = authAction.getUser();

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
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    getGenealogy(`${user.referral}?isfirst=true`);
  }, []);
  console.log("keys", user);

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
      // setData(newData);
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
