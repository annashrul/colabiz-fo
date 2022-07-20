import {
  Col,
  Button,
  Card,
  Message,
  Row,
  Empty,
  Spin,
  Popconfirm,
  Tooltip,
  Typography,
  Badge,
  Collapse,
  message,
} from "antd";

const { Panel } = Collapse;
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  CheckOutlined,
  WalletOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../shared/StatCard";
import { theme } from "../styles/GlobalStyles";
import { checkout } from "../../redux/actions/paket.action";
import Router from "next/router";
import general_helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";
import NotFound from "../NotFound";
import authAction from "../../action/auth.action";
import {
  getCartAction,
  postCart,
  deleteCartAction,
} from "../../redux/actions/cart.action";
import { useAppState } from "../shared/AppProvider";
import ModalPin from "../ModalPin";
const ButtonGroup = Button.Group;
const { Text } = Typography;
const CheckoutProduct = () => {
  const dispatch = useDispatch();
  const [indexMetodePembayaran, setIndexMetodePembayaran] = useState(0);
  const [dataMetodePembayaran, setDataMetodePembayaran] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [modalPin, setModalPin] = useState(false);
  const [idxCart, setIdxCart] = useState(0);
  const [dataStokis, setDataStokis] = useState(null);
  const [state] = useAppState();

  const loadingCheckout = useSelector(
    (state) => state.paketReducer.loadingCheckout
  );
  const loadingCart = useSelector((state) => state.cartReducer.loading);
  const loadingAdd = useSelector((state) => state.cartReducer.loadingAdd);
  const loadingDelete = useSelector((state) => state.cartReducer.loadingDelete);
  const dataCart = useSelector((state) => state.cartReducer.data);
  const info = authAction.getInfo();
  useEffect(() => {
    dispatch(getCartAction());
  }, []);

  useEffect(() => {
    if (localStorage.getItem("dataStokis") === null) {
      Message.info("Anda akan dialihkan ke halaman pembelian").then(() => {
        Router.push(StringLink.pembelian).then(() => {
          setLoadingPage(false);
        });
      });
    } else {
      if (dataCart !== undefined) {
        if (dataCart.length < 1) {
          Message.info("Anda akan dialihkan ke halaman pembelian").then(() => {
            Router.push(StringLink.pembelian).then(() => {
              setLoadingPage(false);
            });
          });
        } else {
          setLoadingPage(false);
          const dataStokis = JSON.parse(localStorage.getItem("dataStokis"));
          setDataStokis(dataStokis);
        }
      }
    }
  }, []);

  // useEffect(() => {
  //   if(dataCart !== undefined){
  //     if(dataCart.length < 1){
  //       Message.info("anda akan dialihkan kehalaman pembelian")
  //     }
  //   }
  // }, [loadingCart]);

  useEffect(() => setVisible(loadingCheckout), [loadingCheckout]);

  useEffect(() => {
    if (!loadingPage) {
      setDataMetodePembayaran([
        {
          metode_pembayaran: "SALDO",
          id_bank: "-",
          bank_name: general_helper.toRp(info.saldo),
          acc_no: "",
          acc_name: "SALDO",
          title: "Gunakan pembayaran menggunakan saldo",
        },
        {
          metode_pembayaran: "TRANSFER",
          id_bank: dataStokis.id_bank,
          bank_name: dataStokis.bank_name,
          acc_no: dataStokis.acc_no,
          acc_name: dataStokis.acc_name,
          title: "Gunakan pembayaran menggunakan transfer bank",
        },
      ]);
    }
  }, [loadingPage]);

  const tempStokis = (title, desc, isRight = "") => {
    return (
      <Row>
        <Col md={6} xs={12} sm={8}>
          {title}
        </Col>
        <Col md={18} xs={12} sm={16}>
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
      id_address: dataStokis.id_address,
      id_bank: dataMetodePembayaran[indexMetodePembayaran].id_bank,
    };
    dispatch(checkout(data));
  };
  let subtotal = 0;
  let subQty = 0;
  return !loadingPage ? (
    <>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="site-collapse-custom-collapse"
        defaultActiveKey={["1"]}
        onChange={(e) => {}}
      >
        <Panel header={`Tata cara pembayaran`} key="1">
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ fontSize: "12px" }}>
              Pastikan data stokis dengan benar
            </li>
            <li style={{ fontSize: "12px" }}>
              Pilih metode pambayaran dengan menyentuh atau mengklik pada bagian
              mana saja
            </li>
            <li style={{ fontSize: "12px" }}>
              Apabilah Terdapat label Dipilih dan ikon dopmet berwarna biru,
              maka
            </li>
            <li style={{ fontSize: "12px" }}>
              metode pembayaran berhasil dipilih
            </li>
            <li style={{ fontSize: "12px" }}>
              Anda bisa menambah ataupun mengurangi jumlah qty paket dengan
              menyentuh atau mengklik tombol + dan -. Atau,
            </li>
            <li style={{ fontSize: "12px" }}>
              anda juga dapat menhapus paket dengan menyentuh atau mengklik
              tomboh tong sampah yang bergaris merah di samping kiri tombol -
            </li>
            <li style={{ fontSize: "12px" }}>
              Sentuh atau klik tombol checkout yang berwarna biru untuk
              melanjutkan ke proses berikutnya. Atau,
            </li>
            <li style={{ fontSize: "12px" }}>
              Sentuh atau klik tombol kembali yang berwarna putih untuk kembali
              ke halaman pembelian.
            </li>
          </ul>
        </Panel>
      </Collapse>
      <br />
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
                  <p>{val.title}</p>
                  <Badge.Ribbon
                    text={indexMetodePembayaran === key ? "Dipilih" : ""}
                  >
                    <StatCard
                      clickHandler={() => setIndexMetodePembayaran(key)}
                      title={
                        <span style={{ marginLeft: "5px" }}>{`${val.bank_name}${
                          val.acc_no !== "" ? "- " + val.acc_no : ""
                        }`}</span>
                      }
                      value={
                        <span style={{ marginLeft: "5px" }}>
                          {val.acc_name}
                        </span>
                      }
                      icon={<WalletOutlined style={{ fontSize: "20px" }} />}
                      color={
                        indexMetodePembayaran === key
                          ? theme.primaryColor
                          : theme.darkColor
                      }
                    />
                  </Badge.Ribbon>
                  <br />
                </span>
              );
            })}
          </Card>
        </Col>
        <Col md={12} xs={24} sm={24}>
          <Card title="Daftar Paket Anda" className="mb-2">
            <Spin spinning={false}>
              {dataCart && dataCart.length > 0 ? (
                dataCart.map((res, key) => {
                  let qty = parseInt(res.qty, 10);
                  subtotal += parseInt(res.price, 10) * qty;
                  subQty += qty;
                  return (
                    <Row
                      key={key}
                      gutter={16}
                      className={dataCart.length > 1 ? "mb-2" : ""}
                      style={{ cursor: "pointer" }}
                    >
                      <Col md={5} xs={5} sm={8}>
                        <img
                          style={{
                            height: state.mobile ? "50px" : "70px",
                            width: "100%",
                            borderRadius: "10px",
                          }}
                          alt={res.gambar}
                          src={res.gambar}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = general_helper.imgDefault;
                          }}
                        />
                      </Col>
                      <Col md={19} xs={19} sm={16}>
                        <Tooltip title={res.paket}>
                          <Text style={{ width: 200 }} ellipsis={true}>
                            <h5>{res.paket}</h5>
                          </Text>
                        </Tooltip>

                        <Row>
                          <Col md={12} xs={12} sm={12}>
                            <p
                              style={{
                                fontSize: state.mobile ? "11px" : "14px",
                              }}
                            >
                              {general_helper.toRp(res.price, true)} x {qty} ={" "}
                              {general_helper.toRp(
                                parseInt(res.price, 10) * qty,
                                true
                              )}
                            </p>
                          </Col>
                          <Col md={12} xs={12} sm={12}>
                            <ButtonGroup style={{ float: "right" }}>
                              <Popconfirm
                                visible={idxCart === key && visibleDelete}
                                title="Anda yakin akan meneruskan proses ini ?"
                                onConfirm={(e) => {
                                  dispatch(deleteCartAction(res.id));
                                }}
                                okText="Oke"
                                cancelText="Batal"
                                onCancel={() => setVisibleDelete(false)}
                                okButtonProps={{
                                  loading: idxCart === key && loadingDelete,
                                }}
                              >
                                <Button
                                  size="small"
                                  danger
                                  onClick={(e) => {
                                    setIdxCart(key);
                                    setVisibleDelete(true);
                                  }}
                                >
                                  <DeleteOutlined
                                    style={{ fontSize: "12px" }}
                                  />
                                </Button>
                              </Popconfirm>

                              <Button
                                loading={idxCart === key && loadingDelete}
                                size="small"
                                onClick={(e) => {
                                  if (qty > 1) {
                                    setIdxCart(key);
                                    setTimeout(
                                      () =>
                                        dispatch(
                                          postCart(res.id_paket, "delete")
                                        ),
                                      20
                                    );
                                  }
                                }}
                              >
                                <MinusOutlined style={{ fontSize: "12px" }} />
                              </Button>
                              <Button size="small">
                                <small>{parseInt(res.qty, 10)}</small>
                              </Button>
                              <Button
                                loading={idxCart === key && loadingAdd}
                                size="small"
                                onClick={(e) => {
                                  if (parseInt(res.stock, 10) > qty) {
                                    setIdxCart(key);
                                    setTimeout(
                                      () => dispatch(postCart(res.id_paket)),
                                      20
                                    );
                                  }
                                }}
                              >
                                <PlusOutlined style={{ fontSize: "12px" }} />
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <Empty />
              )}
            </Spin>
          </Card>
          <Card title="Informasi Pembayaran">
            {dataMetodePembayaran !== undefined &&
              dataMetodePembayaran.length > 0 &&
              tempStokis(
                "Metode pembayaran",
                dataMetodePembayaran[indexMetodePembayaran].metode_pembayaran,
                "right"
              )}
            {tempStokis(
              "Qty Dibeli",
              general_helper.toRp(subQty, true),
              "right"
            )}
            {tempStokis("Total", general_helper.toRp(subtotal), "right")}

            <Row justify="end" gutter={16} className="mt-5">
              <Col>
                <Button
                  className="mr-2"
                  type="dashed"
                  onClick={(e) => {
                    Router.push(StringLink.pembelian);
                    localStorage.removeItem("dataStokis");
                  }}
                >
                  Kembali
                </Button>
                {dataMetodePembayaran !== undefined &&
                  dataMetodePembayaran.length > 0 && (
                    <Popconfirm
                      visible={visible}
                      title={`Anda yakin akan meneruskan transaksi ini ? metode pembayaran yang anda pilih menggunakan ${dataMetodePembayaran[indexMetodePembayaran].metode_pembayaran}`}
                      onConfirm={(e) => {
                        if (
                          dataMetodePembayaran[indexMetodePembayaran]
                            .metode_pembayaran === "TRANSFER"
                        ) {
                          handleCheckout();
                        } else {
                          setModalPin(true);
                        }
                      }}
                      okText="Oke"
                      cancelText="Batal"
                      onCancel={() => setVisible(false)}
                      okButtonProps={{
                        loading: loadingCheckout,
                      }}
                    >
                      <Button
                        disabled={dataCart.length < 1}
                        type="primary"
                        onClick={(e) => {
                          // if (parseInt(info.saldo, 10) > 0) {
                            setVisible(true);
                          // } else {
                          //   message.info("saldo anda tidak cukup");
                          // }
                        }}
                      >
                        Checkout
                      </Button>
                    </Popconfirm>
                  )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {modalPin &&
        dataMetodePembayaran[indexMetodePembayaran].metode_pembayaran ===
          "SALDO" && (
          <ModalPin
            submit={(e) => {
              setVisible(false);
              handleCheckout();
            }}
            cancel={(e) => {
              setModalPin(false);
            }}
            modalPin={modalPin}
            loading={loadingCheckout}
          />
        )}
    </>
  ) : (
    <Spin spinning={loadingPage}>
      <NotFound />
    </Spin>
  );
};

export default CheckoutProduct;
