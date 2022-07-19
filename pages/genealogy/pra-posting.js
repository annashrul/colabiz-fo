import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { arrayToTree } from "performant-array-to-tree";
import moment from "moment";
import authAction from "../../action/auth.action";
import Index from "../../components/genealogy/Index";
import Matahari from "../../components/genealogy/matahari";
import { Tabs, Modal, Spin } from "antd";
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

const GenealogyPraPosting = () => {
  const [data, setData] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
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
        no: 0,
        status: dataConfig.status_member,
        activate: dataConfig.activate,
        id_member: user.id,
        totalPinAktivasi: dataConfig.total_pin_aktivasi,
      },
    ]);
    setLoadingPage(false);
  };

  useEffect(() => {
    // setLoading(loadingConfig);
    if (dataConfig !== undefined) {
      console.log("config", dataConfig);
    }
    getGenealogy(`${user.referral}?isfirst=true`);
  }, []);
  const onChange = async (val, keys) => {
    // setLoadingPage(true);
    await handleGet("member/genealogy/" + val, (res, status) => {
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
      }
      setLoadingPage(false);
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
  return (
    <Spin spinning={loadingPage}>
      {arrayToTree(data.length > 0 ? data : [], {
        dataField: null,
        childrenField: "children",
      }).map((res, index) => {
        return (
          <Index
            key={index}
            no={res.no}
            isActive={res.isActive}
            loading={loadingPage}
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
            totalPinAktivasi={res.totalPinAktivasi}
          />
        );
      })}
    </Spin>
  );
};

export default GenealogyPraPosting;
