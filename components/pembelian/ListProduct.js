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
  Pagination,
} from "antd";
import {
  HomeOutlined,
  CheckOutlined,
  FilterOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
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
import { getPaket } from "../../redux/actions/paket.action";
import CardPaket from "../paket/CardPaket";
import Router from "next/router";
import general_helper from "../../helper/general_helper";
import { StringLink } from "../../helper/string_link_helper";

const { Option } = Select;
const { Meta } = Card;
const Search = Input.Search;

const ListProduct = () => {
  const dispatch = useDispatch();
  const [formFilter] = Form.useForm();
  const [dataStokis, setDataStokis] = useState({});
  const [queryString, setQueryString] = useState("");
  const [indexStockis, setIndexStockis] = useState(0);
  const [isModalFilter, setIsModalFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { loadingData, data, pagination } = useSelector(
    (state) => state.stockisReducer
  );
  const {
    loadingRegister,
    dataRegister,
    paginationRegister,
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
    loadingDistricts,
  } = useSelector((state) => state.addressReducer);

  useEffect(() => {
    dispatch(getStockisAction("page=1"));
    dispatch(getPaket("page=1", "REGISTER"));
    dispatch(getPaket("page=1", "SMART_CONTRACT"));
  }, []);
  useEffect(() => {
    if (!loadingData) {
      if (data.length > 0) {
        setDataStokis(data[0]);
      }
    }
  }, [loadingData]);

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
    let objFilter = `page=1${e.kd_prov}${e.kd_kota}${e.kd_kec}${e.name}`;
    setIsModalFilter(false);
    setTimeout(() => {
      dispatch(getStockisAction(objFilter));
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

  const goToCheckout = (val) => {
    localStorage.setItem("dataStokis", JSON.stringify(dataStokis));
    localStorage.setItem("dataPaket", JSON.stringify(val));
    setTimeout(() => {
      Router.push(StringLink.checkout);
    }, 300);
  };

  return (
    <>
      <Card
        title="Stokis"
        extra={
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsModalFilter(true);
            }}
          >
            <FilterOutlined />
          </span>
        }
      >
        <Spin spinning={loadingData}>
          <Row gutter={16}>
            {data !== undefined && data.length > 0 ? (
              data.map((val, key) => {
                return (
                  <Col
                    key={key}
                    xs={24}
                    sm={12}
                    md={6}
                    className="mb-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setDataStokis(val);
                      setIndexStockis(key);
                    }}
                  >
                    <StatCard
                      clickHandler={() => {
                        setDataStokis(val);
                        setIndexStockis(key);
                      }}
                      type={indexStockis === key ? "fill" : ""}
                      title={val.mobile_no}
                      value={`${val.name}`}
                      icon={
                        indexStockis === key ? (
                          <CheckOutlined style={{ fontSize: "20px" }} />
                        ) : (
                          <HomeOutlined style={{ fontSize: "20px" }} />
                        )
                      }
                      color={
                        indexStockis === key
                          ? theme.primaryColor
                          : theme.darkColor
                      }
                    />
                  </Col>
                );
              })
            ) : (
              <Empty />
            )}
          </Row>
          <Row justify="end" gutter={16}>
            <Col>
              <Button
                disabled={currentPage === 1}
                onClick={(e) => {
                  if (currentPage > 1) {
                    let page = currentPage;
                    page -= 1;
                    setCurrentPage(page);
                    dispatch(getStockisAction(`page=${page}`));
                  }
                }}
              >
                <CaretLeftOutlined />
              </Button>
              <Button className="mr-2 ml-2">{currentPage}</Button>
              <Button
                disabled={pagination.to >= parseInt(pagination.total, 10)}
                onClick={(e) => {
                  console.log(pagination);
                  if (pagination.to >= parseInt(pagination.total, 10)) {
                    Message.info("data stokis habis");
                  } else {
                    let page = currentPage;
                    page += 1;
                    setCurrentPage(page);
                    dispatch(getStockisAction(`page=${page}&perpage=12`));
                  }
                }}
              >
                <CaretRightOutlined />
              </Button>
            </Col>
          </Row>
        </Spin>
      </Card>
      <Row gutter={16} className={"mt-3"}>
        <Col xs={24} sm={12} md={12} className="mb-3">
          <Card title="PAKET REGISTER">
            <Spin spinning={loadingRegister}>
              <CardPaket
                callback={(val) => goToCheckout(val)}
                loading={loadingRegister}
                data={dataRegister}
                pagination={paginationRegister}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Card title="PAKET SMART CONTRACT">
            <CardPaket
              callback={(val) => goToCheckout(val)}
              loading={loadingSmartContract}
              data={dataSmartContract}
              pagination={paginationSmartContract}
            />
          </Card>
        </Col>
      </Row>

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
    </>
  );
};

export default ListProduct;
