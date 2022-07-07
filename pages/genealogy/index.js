import { Collapse, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
// import { arrayToTree } from "performant-array-to-tree";
import listToTree from "list-to-tree-lite";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getGenealogyAction } from "../../redux/actions/member.action";
import authAction from "../../action/auth.action";

moment.locale("id");
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const Genealogy = () => {
  const dispatch = useDispatch();
  const user = authAction.getUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anying, setAnying] = useState([]);
  const { loadingGenealogy, dataGenealogy } = useSelector(
    (state) => state.memberReducer
  );

  const getGenealogy = async (where) => {
    setLoading(true);
    await handleGet("member/genealogy/" + where, (res, status) => {
      let newData = data;
      res.data.map((res) => {
        newData.push({ id: res.id, parent: res.parentId, any: res.name });
      });
      setData(newData);

      setLoading(false);
      // newData.push(res.data);
      console.log("new data", listToTree(newData));
    });
  };

  useEffect(() => {
    getGenealogy("KOLABIZMASTER?isfirst=true");
    // dispatch(getGenealogyAction("KOLABIZMASTER?isfirst=true"));
  }, []);

  const onChange = (key, res) => {
    // anying.push(res);
    // setAnying(anying);
    // if (res.hasChild) {
    getGenealogy(res.id);
    // dispatch(getGenealogyAction(res.id));
    // }
  };

  console.log("anying", loading);

  return (
    <Spin tip="Tunggu Sebentar..." size="large" spinning={loading}>
      {data.map((val, key) => {
        return (
          <Collapse
            key={key}
            onChange={(key) => {
              onChange(key, val);
            }}
          >
            <Panel header={val.any} key={key}>
              {val.children.length > 0
                ? val.children.map((row, idx) => {
                    return (
                      <Collapse
                        defaultActiveKey={idx}
                        onChange={(key) => {
                          onChange(key, row);
                        }}
                      >
                        <Panel header={row.any}></Panel>
                      </Collapse>
                    );
                  })
                : ""}
              {/* {val.hasChild > 0 &&
            val.child.map((row, idx) => {
              return (
                <Collapse
                  defaultActiveKey={idx}
                  onChange={(key) => {
                    onChange(key, row);
                  }}
                >
                  <Panel header={row.name}>
                    <p>{row.name}</p>
                  </Panel>
                </Collapse>
              );
            })} */}
            </Panel>
          </Collapse>
        );
      })}
    </Spin>
  );
};

export default Genealogy;
