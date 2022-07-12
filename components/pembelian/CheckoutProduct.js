import {
  Col,
  Button,
  Skeleton,
  Card,
  Message,
  PageHeader,
  Row,
  Empty,
  Modal,
  Spin,
  Form,
  Select,
  Input,
  Badge,
  Popconfirm,
} from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  QuestionOutlined,
  CheckOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStockisAction } from "../../redux/actions/stockis.action";
import StatCard from "../shared/StatCard";
import { theme } from "../styles/GlobalStyles";
import {
  provinceAction,
  cityAction,
  districtsAction,
} from "../../redux/actions/address.action";
import { checkout, getPaket } from "../../redux/actions/paket.action";
import CardPaket from "../paket/CardPaket";
import Router from "next/router";
import general_helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";
import NotFound from "../NotFound";
import authAction from "../../action/auth.action";
const ButtonGroup = Button.Group;
const { Option } = Select;
const { Meta } = Card;
const Search = Input.Search;

const CheckoutProduct = () => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [indexMetodePembayaran, setIndexMetodePembayaran] = useState(0);
  const [dataMetodePembayaran, setDataMetodePembayaran] = useState([]);
  const [dataStokis, setDataStokis] = useState({});
  const [dataPaket, setDataPaket] = useState({});
  const [info, setInfo] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [visible, setVisible] = useState(false);
  const loadingCheckout = useSelector(
    (state) => state.paketReducer.loadingCheckout
  );
  useEffect(() => {
    let storagePaket = JSON.parse(localStorage.getItem("dataPaket"));
    let storageStokis = JSON.parse(localStorage.getItem("dataStokis"));
    if (storagePaket === null || storagePaket === undefined) {
      Message.info("Anda akan dialihkan ke halaman pembelian").then(() => {
        Router.push(StringLink.pembelian).then(() => setLoadingPage(false));
      });
    } else {
      setLoadingPage(false);
      setDataStokis(storageStokis);
      setDataPaket(storagePaket);
      let info = authAction.getInfo();
      console.log("data info", info);
      setInfo(info);
    }
  }, []);

  useEffect(() => setVisible(loadingCheckout), [loadingCheckout]);

  useEffect(() => {
    setCount(1);
    if (!loadingPage) {
      setDataMetodePembayaran([
        {
          metode_pembayaran: "TRANSFER",
          id_bank: dataStokis.id_bank,
          bank_name: dataStokis.bank_name,
          acc_no: dataStokis.acc_no,
          acc_name: dataStokis.acc_name,
        },
        {
          metode_pembayaran: "SALDO",
          id_bank: "-",
          bank_name: general_helper.toRp(info.saldo),
          acc_no: "",
          acc_name: "SALDO",
        },
      ]);
    }
  }, [loadingPage]);

  const increase = () => {
    if (count >= parseInt(dataPaket.stock, 10)) {
      setCount(parseInt(dataPaket.stock, 10));
    } else {
      setCount(count + 1);
    }
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 1) {
      newCount = 1;
    }

    setCount(newCount);
  };
  const tempStokis = (title, desc, isRight = "") => {
    return (
      <Row>
        <Col md={6} xs={8} sm={8}>
          {title}
        </Col>
        <Col md={18} xs={16} sm={16}>
          : <span style={{ float: isRight }}>{desc}</span>
        </Col>
      </Row>
    );
  };

  const handleCheckout = () => {
    let data = {
      metode_pembayaran:
        dataMetodePembayaran[indexMetodePembayaran].metode_pembayaran,
      id_stockis: dataStokis.id,
      id_address: dataStokis.id,
      id_bank: dataMetodePembayaran[indexMetodePembayaran].id_bank,
      detail: [
        {
          id_paket: dataPaket.id,
          harga: dataPaket.price,
          qty: count,
          total: parseInt(dataPaket.price, 10) * count,
        },
      ],
    };

    dispatch(checkout(data));
  };
  return !loadingPage ? (
    <>
      <Row gutter={16}>
        <Col md={12} xs={24} sm={24} className="mb-2">
          <Card title="Stokis">
            {tempStokis("Nama", dataStokis.name)}
            {tempStokis("No Telepon", dataStokis.mobile_no)}
            {dataStokis.main_address}, {dataStokis.kecamatan}, {dataStokis.kota}
            ,{dataStokis.provinsi}
          </Card>
          <Card title="Metode Pembayaran" className="mt-2">
            {dataMetodePembayaran.map((val, key) => {
              return (
                <span
                  key={key}
                  className="mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIndexMetodePembayaran(key)}
                >
                  <StatCard
                    clickHandler={() => setIndexMetodePembayaran(key)}
                    type={"fill"}
                    title={`${val.bank_name}${
                      val.acc_no !== "" ? "- " + val.acc_no : ""
                    }`}
                    value={val.acc_name}
                    icon={
                      indexMetodePembayaran === key ? (
                        <CheckOutlined style={{ fontSize: "20px" }} />
                      ) : (
                        <WalletOutlined style={{ fontSize: "20px" }} />
                      )
                    }
                    color={
                      indexMetodePembayaran === key
                        ? theme.primaryColor
                        : theme.darkColor
                    }
                  />
                  <br />
                </span>
              );
            })}
          </Card>
        </Col>
        <Col md={12} xs={24} sm={24}>
          <Card title="Daftar Paket Anda" className="mb-2">
            <CardPaket
              callback={(val) => {}}
              loading={false}
              data={[JSON.parse(localStorage.getItem("dataPaket"))]}
            />

            <ButtonGroup style={{ float: "right", marginTop: "3px" }}>
              <Button onClick={decline}>
                <MinusOutlined />
              </Button>
              <Button>{count}</Button>
              <Button onClick={increase}>
                <PlusOutlined />
              </Button>
            </ButtonGroup>
          </Card>
          <Card title="Rincian Pembayaran">
            {tempStokis(
              "Harga Paket",
              general_helper.toRp(parseInt(dataPaket.price, 10)),
              "right"
            )}
            {tempStokis(
              "Qty Dibeli",
              general_helper.toRp(count, true),
              "right"
            )}
            {tempStokis(
              "Subtotal",
              general_helper.toRp(parseInt(dataPaket.price, 10) * count),
              "right"
            )}
            {tempStokis(
              "Total",
              general_helper.toRp(parseInt(dataPaket.price, 10) * count),
              "right"
            )}
          </Card>
        </Col>
      </Row>
      <Row justify="end" gutter={16} className="mt-2">
        <Col>
          <Button
            className="mr-2"
            type="dashed"
            onClick={(e) => {
              Router.push(StringLink.pembelian);
              localStorage.removeItem("dataStokis");
              localStorage.removeItem("dataPaket");
            }}
          >
            Kembali
          </Button>
          <Popconfirm
            visible={visible}
            title="Anda yakin akan meneruskan transaksi ini ?"
            onConfirm={(e) => handleCheckout()}
            okText="Oke"
            cancelText="Batal"
            onCancel={() => {}}
            okButtonProps={{
              loading: loadingCheckout,
            }}
          >
            <Button type="primary" onClick={(e) => setVisible(true)}>
              Checkout
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </>
  ) : (
    <Spin spinning={loadingPage}>
      <NotFound />
    </Spin>
  );
};

export default CheckoutProduct;
