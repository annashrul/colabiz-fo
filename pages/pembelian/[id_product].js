import {
  Row,
  Col,
  PageHeader,
  Card,
  Image,
  Spin,
  Badge,
  Tag,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import { useAppState } from "../../components/shared/AppProvider";
import Helper from "../../helper/general_helper";
import moment from "moment";
import Router from "next/router";

import { useSelector, useDispatch } from "react-redux";
import { getPaketDetail } from "../../redux/actions/paket.action";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { getConfigAction } from "../../redux/actions/info.action";
import { postCart } from "../../redux/actions/cart.action";
import FormComponent from "../../components/profile/formComponent";
import authAction from "../../action/auth.action";
moment.locale("id");
const DetailProduct = () => {
  const [isModalPin, setIsModalPin] = useState(false);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();
  const dispatch = useDispatch();
  const { loadingDetail, dataDetail } = useSelector(
    (state) => state.paketReducer
  );
  const { dataConfig } = useSelector((state) => state.infoReducer);
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
  }, []);
  useEffect(() => {
    dispatch(getConfigAction());
    console.log(Router.router.query.id_product);
    dispatch(getPaketDetail(Router.router.query.id_product));
  }, []);

  const temp = () => {
    return (
      !loadingDetail &&
      dataDetail !== undefined && (
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Badge.Ribbon text={dataDetail.title_alokasi}>
              <Card
                title={
                  <small style={{ fontSize: font }}>{dataDetail.title}</small>
                }
                cover={<Image src={dataDetail.gambar} />}
              >
                <Row>
                  <Col md={12} xs={12} sm={12}>
                    <Tag color="#f50">{Helper.toRp(dataDetail.price)}</Tag>
                  </Col>
                  <Col md={12} xs={12} sm={12}>
                    <Tag style={{ float: "right" }} color="purple">
                      Stok : {Helper.toRp(dataDetail.stock, true)}
                    </Tag>
                  </Col>
                </Row>
                <br />
                <small style={{ fontSize: font }}>
                  {/* {dataDetail.caption} */}
                  {Helper.rmHtml(
                    dataDetail !== undefined ? dataDetail.caption : ""
                  )}
                </small>
              </Card>
            </Badge.Ribbon>
            <Button
              onClick={(e) => {
                if (dataConfig.pin === "-") {
                  setIsModalPin(true);
                } else {
                  dispatch(postCart(dataDetail.id));
                }
              }}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <ShoppingCartOutlined /> Tambah
            </Button>
          </Col>
        </Row>
      )
    );
  };

  return (
    <Spin spinning={loadingDetail}>
      {state.mobile ? (
        <PageHeader
          className="site-page-header"
          onBack={() => Router.back()}
          title="Kembali"
        >
          {temp()}
        </PageHeader>
      ) : (
        temp()
      )}
      {isModalPin && (
        <FormComponent
          isModal={isModalPin}
          ok={(e) => {
            setIsModalPin(false);
          }}
          cancel={(e) => setIsModalPin(false)}
          userData={authAction.getUser()}
          isCreate={true}
        />
      )}
    </Spin>
  );
};

export default DetailProduct;
