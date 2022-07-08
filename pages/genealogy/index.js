import { Collapse, Spin, Message } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import listToTree from "list-to-tree-lite";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getGenealogyAction } from "../../redux/actions/member.action";
import authAction from "../../action/auth.action";
import Index from "../../components/genealogy/Index";

moment.locale("id");
const { Panel } = Collapse;

const Genealogy = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = authAction.getUser();

  const getGenealogy = async (where) => {
    setData([
      {
        hasChild: parseInt(user.jumlah_downline, 10) > 0,
        id: "KOLABIZMASTER",
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
    getGenealogy(`${"KOLABIZMASTER"}?isfirst=true`);
  }, []);

  const onChange = async (val, keys) => {
    console.log("keys", keys);
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
            onChange(val, index);
          }}
        />
      </span>
    );
  });
};

export default Genealogy;
