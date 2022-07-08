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
    console.log("user", user);
    setData([
      {
        hasChild: parseInt(user.jumlah_downline, 10) > 0,
        id: user.referral,
        join_date: user.created_at,
        name: user.fullname,
        parentId: null,
        picture: user.foto,
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    getGenealogy(`${user.referral}?isfirst=true`);
  }, []);

  const onChange = async (val) => {
    setLoading(true);
    await handleGet("member/genealogy/" + val, (res, status) => {
      console.log("data", data);
      console.log("res.data", res.data);
      console.log("concat", data.concat(res.data));
      if (res.data.length > 0) {
        setData(data.concat(res.data));
      } else {
        Message.success("data tidak ada");
      }
      setLoading(false);
      // setData(newData);
    });
  };

  // console.log("anying", data);

  return (
    <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
      {arrayToTree(data.length > 0 ? data : [], {
        dataField: null,
        childrenField: "children",
      }).map((res, key) => (
        <Index
          key={key}
          {...res}
          loading={loading}
          joinDate={res.join_date}
          picture={res.picture}
          id={res.id}
          name={res.name}
          children={res.children}
          callback={(val) => onChange(val)}
        />
      ))}
    </Spin>
  );
};

export default Genealogy;
