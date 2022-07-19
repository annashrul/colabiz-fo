import {
  Col,
  Button,
  Card,
  Message,
  Row,
  Empty,
  Modal,
  Spin,
  Form,
  Select,
  Input,
  Alert,
  Badge,
  Divider,
  Collapse,
} from "antd";
const { Panel } = Collapse;
import Marquee from "react-fast-marquee";
import {
  HomeOutlined,
  CheckOutlined,
  FilterOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  CloseOutlined,
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
import { getCartAction, postCart } from "../../redux/actions/cart.action";
import { getPaket } from "../../redux/actions/paket.action";
import CardPaket from "../paket/CardPaket";
import { useAppState } from "../shared/AppProvider";
import { getConfigAction } from "../../redux/actions/info.action";
import FormComponent from "../profile/formComponent";
import authAction from "../../action/auth.action";
import { StringLink } from "../../helper/string_link_helper";
const { Option } = Select;
import Router from "next/router";
import CardProduct from "./CardProduct";

const ListProduct = () => {
  const dispatch = useDispatch();
  const [formFilter] = Form.useForm();
  const [queryString, setQueryString] = useState("");
  const [indexStockis, setIndexStockis] = useState("");
  const [isModalFilter, setIsModalFilter] = useState(false);
  const [isModalPin, setIsModalPin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexKategoriPaket, setIndexKategoriPaket] = useState(0);
  const [step, setStep] = useState(1);
  const [dataStockis, setDataStockis] = useState([]);
  const [state] = useAppState();
  const { loadingConfig, dataConfig } = useSelector(
    (state) => state.infoReducer
  );
  const { loadingData, data, pagination } = useSelector(
    (state) => state.stockisReducer
  );
  const loadingCart = useSelector((state) => state.cartReducer.loadingAdd);
  const dataCart = useSelector((state) => state.cartReducer.data);
  const {
    loadingRegister,
    dataRegister,
    paginationRegister,
    loadingHappyShopping,
    dataHappyShopping,
    paginationHappyShopping,
    loadingSmartContract,
    dataSmartContract,
    paginationSmartContract,
  } = useSelector((state) => state.paketReducer);

  const {
    dataProvince,
    loadingProvince,
    dataCity,
    loadingCity,
    dataDistricts,
  } = useSelector((state) => state.addressReducer);

  useEffect(() => {
    console.log("locls", localStorage.linkBackProduct);
    dispatch(getStockisAction("page=1"));
    dispatch(getCartAction());
    // dispatch(getPaket("page=1", "REGISTER"));
    // dispatch(getPaket("page=1", "HAPPY_SHOPPING"));
    dispatch(getConfigAction());
  }, []);

  useEffect(() => {
    if (localStorage.linkBackProduct !== undefined) {
      setStep(3);
    }
  }, []);

  useEffect(() => {
    if (!loadingData && data !== undefined) {
      if (data.length > 0) {
        // setIndexStockis(0);
        // handleSetStockis(data[0], 0);
        // console.log("set stokis", data[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (!loadingData && !loadingConfig) {
      if (data !== undefined && data.length > 0) {
        if (dataConfig.id_stockis === "-") {
          setDataStockis(data);
        } else {
          handleSetStockis(dataConfig.data_stockis, 0);
          setDataStockis([dataConfig.data_stockis]);
        }
      }
    }
  }, [loadingData, loadingConfig]);
  useEffect(() => {
    dispatch(provinceAction());
  }, []);

  useEffect(() => {
    if (!loadingCity && dataCity !== undefined) {
      if (dataCity.length > 0) {
        formFilter.setFieldsValue({ kd_kota: "" });
        formFilter.setFieldsValue({ kd_kec: "" });
        dispatch(districtsAction(dataCity[0].id));
      }
    }
  }, [loadingCity]);

  const handleFilter = (e) => {
    if (e.kd_prov === "" || e.kd_prov === undefined) {
      e.kd_prov = "";
    } else {
      e.kd_prov = `&provinsi=${e.kd_prov}`;
    }
    if (e.kd_kota === "" || e.kd_kota === undefined) {
      e.kd_kota = "";
    } else {
      e.kd_kota = `&kota=${e.kd_kota}`;
    }
    if (e.kd_kec === "" || e.kd_kec === undefined) {
      e.kd_kec = "";
    } else {
      e.kd_kec = `&kecamatan=${e.kd_kec}`;
    }
    if (e.name === "" || e.name === undefined) {
      e.name = "";
    } else {
      e.name = `&q=${e.name}`;
    }
    let objFilter = `${e.kd_prov}${e.kd_kota}${e.kd_kec}${e.name}`;
    setIsModalFilter(false);
    setQueryString(objFilter);
    setTimeout(() => {
      dispatch(getStockisAction("page=1" + objFilter));
      setIndexStockis(0);
    }, 200);
  };
  const handleChangeAddress = (value, col = "") => {
    let objData = Object.assign(queryString, { [col]: value });
    setQueryString(objData);
    if (col === "prov") {
      dispatch(cityAction(value));
    } else if (col === "kota") {
      dispatch(districtsAction(value));
    }
  };

  const handleSetStockis = (val, key) => {
    localStorage.setItem("dataStokis", JSON.stringify(val));
    setIndexStockis(key);
  };

  const handleStep = () => {};

  const kategoriPaket = ["REGISTER", "SMART_CONTRACT", "HAPPY_SHOPPING"];

  return (
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
        <Panel
          key="1"
          header={`lihat cara memilih ${
            step === 1 ? "stokis" : step === 2 ? "kategori paket" : "paket"
          }`}
        >
          {step === 1 && (
            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ fontSize: "12px" }}>
                Silahkan pilih stokis terlebih dahulu
              </li>
              <li style={{ fontSize: "12px" }}>
                Sentuh atau klik pada bagian mana saja
              </li>
              <li style={{ fontSize: "12px" }}>
                Cari stokis yang mempunyai label AKTIF MELAYANI
              </li>
              <li style={{ fontSize: "12px" }}>
                stokis yang dipilih akan ditandai dengan warna biru dan ikon
                ceklis
              </li>
              <li style={{ fontSize: "12px" }}>
                sentuh atau klik tombol lanjut dibawah untuk melanjutkan proses
                ke tahap selanjutnya
              </li>
            </ul>
          )}
          {step === 2 && (
            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ fontSize: "12px" }}>
                Silahkan pilih kategori paket terlebih dahulu
              </li>
              <li style={{ fontSize: "12px" }}>
                Sentuh atau klik pada bagian mana saja
              </li>
              <li style={{ fontSize: "12px" }}>
                Kategori paket yang dipilih akan ditandai dengan label warna
                biru dan bertuliskan paket dipilih
              </li>
              <li style={{ fontSize: "12px" }}>
                sentuh atau klik tombol lanjut dibawah untuk melanjutkan proses
                ke tahap selanjutnya
              </li>
              <li style={{ fontSize: "12px" }}>
                sentuh atau klik tombol kembali dibawah untuk kembali ke proses
                sebelumnya
              </li>
            </ul>
          )}
          {step === 3 && (
            <ul style={{ paddingLeft: "20px" }}>
              <li style={{ fontSize: "12px" }}>
                Silahkan pilih paket {kategoriPaket[indexKategoriPaket]}
              </li>
              <li style={{ fontSize: "12px" }}>
                Sentuh, klik atau dekatkan cursor pada bagian deskripsi apabila
                anda ingin mengetahui deskripsi dari produk ini
              </li>
              <li style={{ fontSize: "12px" }}>
                Sentuh atau klik tombol tambah untuk menambah jumlah qty item
                tersebut
              </li>
              <li style={{ fontSize: "12px" }}>
                Apabila proses tambah berhasil, tahap selanjutnya sentuh atau
                klik ikon keranjang yang berada di pojok kanan atas anda, atau
              </li>
              <li style={{ fontSize: "12px" }}>
                sentuh atau klik tombol lanjut dibawah untuk melanjutkan proses
                ke tahap selanjutnya
              </li>
              <li style={{ fontSize: "12px" }}>
                sentuh atau klik tombol kembali dibawah untuk kembali ke proses
                sebelumnya
              </li>
            </ul>
          )}
        </Panel>
      </Collapse>
      {step === 1 && (
        <Card
          className="mt-2"
          title="Stokis"
          extra={
            <Row gutter={4}>
              <Col>
                <Button
                  size="small"
                  type="dashed"
                  onClick={() => {
                    setIsModalFilter(true);
                  }}
                >
                  <FilterOutlined /> Cari Stokis
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="dashed"
                  onClick={() => {
                    setIndexStockis("");
                    setQueryString("");
                    dispatch(getStockisAction("page=1"));
                  }}
                >
                  <CloseOutlined /> Reset
                </Button>
              </Col>
            </Row>
          }
        >
          <Spin spinning={loadingData || loadingConfig}>
            <Row gutter={16}>
              {dataStockis !== undefined && dataStockis.length > 0 ? (
                dataStockis.map((val, key) => {
                  return (
                    <Col
                      key={key}
                      xs={24}
                      sm={12}
                      md={8}
                      className="mb-2"
                      style={{
                        cursor:
                          val.status_layanan === 0 ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        console.log("pagination", pagination);
                        if (val.status_layanan !== 0) {
                          handleSetStockis(val, key);
                        }
                      }}
                    >
                      <Badge.Ribbon
                        text={
                          val.status_layanan === 0
                            ? "Tidak Melayani"
                            : "Aktif Melayani"
                        }
                        color={val.status_layanan === 0 ? "orange" : "cyan"}
                      >
                        <StatCard
                          clickHandler={() => {
                            if (val.status_layanan !== 0) {
                              handleSetStockis(val, key);
                            }
                          }}
                          type={
                            indexStockis === key && val.status_layanan === 1
                              ? "fill"
                              : ""
                          }
                          title={
                            <span style={{ marginLeft: "10px" }}>
                              {val.mobile_no}
                            </span>
                          }
                          value={
                            <span style={{ marginLeft: "10px" }}>
                              {val.name}
                            </span>
                          }
                          icon={
                            indexStockis === key && val.status_layanan === 1 ? (
                              <CheckOutlined
                                style={{
                                  fontSize: "20px",
                                }}
                              />
                            ) : (
                              <HomeOutlined
                                style={{
                                  fontSize: "20px",
                                }}
                              />
                            )
                          }
                          color={
                            indexStockis === key && val.status_layanan === 1
                              ? theme.primaryColor
                              : theme.darkColor
                          }
                        />
                      </Badge.Ribbon>
                      <Alert
                        banner
                        message={
                          <Marquee pauseOnHover gradient={false}>
                            {state.mobile ? (
                              <small>
                                &nbsp; {val.main_address}, {val.provinsi},{" "}
                                {val.kota}, {val.kecamatan}
                              </small>
                            ) : (
                              <span>
                                &nbsp; {val.main_address}, {val.provinsi},{" "}
                                {val.kota}, {val.kecamatan}
                              </span>
                            )}
                          </Marquee>
                        }
                      />
                    </Col>
                  );
                })
              ) : (
                <Empty />
              )}
            </Row>
            {dataConfig && dataConfig.id_stockis === "-"
              ? pagination && (
                  <Row justify="end" gutter={16}>
                    <Col>
                      <Button
                        type="primary"
                        disabled={currentPage === 1}
                        onClick={(e) => {
                          if (currentPage > 1) {
                            let page = currentPage;
                            page -= 1;
                            setCurrentPage(page);
                            dispatch(
                              getStockisAction(`page=${page}&${queryString}`)
                            );
                          }
                        }}
                      >
                        <CaretLeftOutlined />
                      </Button>
                      <Button className="mr-2 ml-2">{currentPage}</Button>
                      <Button
                        type="primary"
                        disabled={
                          pagination.to >= parseInt(pagination.total, 10)
                        }
                        onClick={(e) => {
                          if (pagination.to >= parseInt(pagination.total, 10)) {
                            Message.info("data stokis habis");
                          } else {
                            // console.log(pa)
                            let page = currentPage;
                            page += 1;
                            setCurrentPage(page);
                            dispatch(
                              getStockisAction(`page=${page}&${queryString}`)
                            );
                          }
                        }}
                      >
                        <CaretRightOutlined />
                      </Button>
                    </Col>
                  </Row>
                )
              : ""}
          </Spin>
        </Card>
      )}

      {step === 2 && (
        <Card className="mt-2" title="Kategori Paket">
          <Row gutter={16}>
            {kategoriPaket.map((res, key) => {
              return (
                <Col
                  key={key}
                  xs={24}
                  sm={12}
                  md={8}
                  className="mb-2"
                  onClick={() => {
                    setIndexKategoriPaket(key);
                  }}
                >
                  <Badge.Ribbon
                    text={indexKategoriPaket === key ? "Paket Dipilih" : ""}
                  >
                    <StatCard
                      clickHandler={() => {
                        setIndexKategoriPaket(key);
                      }}
                      value={res.replaceAll("_", " ")}
                      color={theme.darkColor}
                    />
                  </Badge.Ribbon>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {step === 3 && (
        <Spin spinning={loadingCart}>
          <br />
          <CardProduct category={kategoriPaket[indexKategoriPaket]} />
        </Spin>
      )}
      <Row gutter={16} align="end" className="mt-2">
        <Col>
          <Button
            onClick={(e) => {
              setStep(step - 1);
            }}
            type="dashed"
            className="mr-2"
          >
            Kembali
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              if (step === 2) {
                localStorage.setItem("linkBackProduct", 3);
                dispatch(getPaket("page=1", kategoriPaket[indexKategoriPaket]));
              } else if (step == 3) {
                if (dataCart.length > 0) {
                  Router.push(StringLink.checkout);
                  return;
                } else {
                  Message.info("silahkan pilih paket terlebih dahulu");
                  return;
                }
              }
              setStep(step + 1);
            }}
          >
            Lanjut
          </Button>
        </Col>
      </Row>

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

      {isModalFilter && (
        <Modal
          centered
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
          footer={null}
          title="Filter Stokis"
          visible={isModalFilter}
        >
          <Form form={formFilter} layout="vertical" onFinish={handleFilter}>
            <Form.Item name="kd_prov" label="Provinsi">
              <Select
                loading={loadingProvince}
                style={{ width: "100%" }}
                showSearch
                placeholder="Pilih Provinsi"
                optionFilterProp="children"
                onChange={(e) => handleChangeAddress(e, "prov", 0)}
                onSearch={(e) => {}}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {dataProvince.map((val, key) => {
                  return (
                    <Option key={key} value={val.id}>
                      {val.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="kd_kota" label="Kota">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Pilih Kota"
                optionFilterProp="children"
                onChange={(e) => handleChangeAddress(e, "kota", 0)}
                onSearch={(e) => {}}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {dataCity.map((val, key) => {
                  return (
                    <Option key={key} value={val.id}>
                      {val.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="kd_kec" label="Kecamatan">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Pilih Kecamatan"
                optionFilterProp="children"
                onChange={(e) => handleChangeAddress(e, "kota", 0)}
                onSearch={(e) => {}}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {dataDistricts.map((val, key) => {
                  return (
                    <Option key={key} value={val.id}>
                      {val.kecamatan}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="name" label="Nama">
              <Input
                onChange={(e) => {
                  let datas = Object.assign(queryString, {
                    name: e.target.value,
                  });
                  setQueryString(datas);
                }}
              />
            </Form.Item>
            <Row gutter={8}>
              <Col md={8} xs={8} sm={8}>
                <Button
                  style={{ width: "100%" }}
                  type="dashed"
                  htmlType="button"
                  onClick={(e) => {
                    setIsModalFilter(false);
                    //   callback("cancel", data);
                  }}
                >
                  Kembali
                </Button>
              </Col>
              <Col md={8} xs={8} sm={8}>
                <Button
                  style={{ width: "100%" }}
                  type="dashed"
                  htmlType="button"
                  onClick={(e) => {
                    formFilter.resetFields();
                  }}
                >
                  Reset
                </Button>
              </Col>
              <Col md={8} xs={8} sm={8}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  className=""
                >
                  Simpan
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ListProduct;
