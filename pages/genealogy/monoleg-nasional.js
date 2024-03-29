import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import moment from "moment";
import authAction from "../../action/auth.action";
import Index from "../../components/genealogy/Index";
import Matahari from "../../components/genealogy/matahari";
import { Tabs, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getGenealogyAction } from "../../redux/actions/member.action";
moment.locale("id");
const { TabPane } = Tabs;
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  aktivasiPinAction,
  getConfigAction,
} from "../../redux/actions/info.action";
const { confirm } = Modal;

const GenealogyMonolegNasional = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let user = authAction.getUser();
  const { loadingGenealogy, dataGenealogy } = useSelector(
    (state) => state.authUserReducer.loadingLogin
  );

  const { loadingConfig, dataConfig } = useSelector(
    (state) => state.infoReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConfigAction());
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          hasChild: parseInt(user.jumlah_downline, 10) > 0,
          id: user.referral,
          join_date: user.created_at,
          name: user.fullname,
          parentId: null,
          picture: user.foto,
          isActive: false,
          no: 0,
          status: dataConfig.status_member,
          activate: dataConfig.activate,
          id_member: user.id,
          totalPinAktivasi: parseInt(dataConfig.total_pin_aktivasi, 10),
        },
      ]);
    }, 1000);
  }, [dataConfig.activate === undefined && loadingConfig]);
  const onChange = async (val, name) => {
    let where = "";
    if (val === user.referral) {
      where = `?isFirst=true`;
    }
    await handleGet(
      `member/genealogy_activate/${val}${where}`,
      (res, status) => {
        if (res.data.length > 0) {
          res.data.map((row, index) => {
            Object.assign(row, {
              isActive: false,
            });
          });
          data.map((row, index) => {
            if (row.id === val) {
              Object.assign(row, { isActive: true, no: index });
            }
          });
          setData(data.concat(res.data));
        } else {
          message.info(`${val} belum mempunyai downline`);
          // alert(`${val} belum mempunyai downline`);
        }
      }
    );
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

  return (
    data.length > 0 && (
      <div style={{ marginTop: "20px", zoom: "70%" }}>
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
                  {arrayToTree(data.length > 0 ? data : [], {
                    dataField: null,
                    childrenField: "children",
                  }).map((res, index) => {
                    return (
                      <Matahari
                        key={index}
                        no={res.no}
                        isActive={res.isActive}
                        loading={false}
                        joinDate={res.join_date}
                        picture={res.picture}
                        id={res.id}
                        name={`${res.name}`}
                        children={res.children}
                        callback={(val, keys) => {
                          onChange(val, res.name);
                        }}
                        status={res.status}
                        activate={res.activate}
                        id_member={res.id_member}
                        handleActive={(id_member, key) => {
                          if (
                            parseInt(dataConfig.total_pin_aktivasi, 10) === 0
                          ) {
                            handleActivate(id_member, index);
                          }
                        }}
                        totalPinAktivasi={res.totalPinAktivasi}
                        hasChild={res.hasChild}
                      />
                    );
                  })}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default GenealogyMonolegNasional;
