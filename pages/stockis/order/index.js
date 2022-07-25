import {
  Table,
  Select,
  Row,
  Col,
  Popconfirm,
  Space,
  Input,
  Form,
  Tooltip,
  Modal,
  Alert,
  Tag,
  Spin,
  message,
} from "antd";
const { Column, ColumnGroup } = Table;
import React, { useEffect, useState } from "react";
import authAction from "../../../action/auth.action";
const Option = Select.Option;
const Search = Input.Search;
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  approveCodeAction,
  approveStockisAction,
  orderStockisAction,
  sendCodeAction,
} from "../../../redux/actions/stockis.action";
import general_helper from "../../../helper/general_helper";
import Router from "next/router";
moment.locale("id");

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const IndexOrderStockis = () => {
  const [searchby, setSearchBy] = useState("kd_trx");
  const [where, setWhere] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [kodeTrx, setKodeTrx] = useState("");
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const dispatch = useDispatch();
  const {
    loadingApprove,
    loadingCancel,
    loadingOrder,
    dataOrder,
    paginationOrder,
  } = useSelector((state) => state.stockisReducer);
  const user = authAction.getUser();

  useEffect(() => {
    console.log("id stokis", user.id_stockis);
    if (
      user.id_stockis === "-" ||
      user.id_stockis === "" ||
      user.id_stockis === undefined
    ) {
      message.info("maaf id stokis anda kosong").then(() => {
        message.info("anda akan dialihkan ke halaman utama").then(() => {
          Router.push("/");
        });
      });
    } else {
      dispatch(orderStockisAction(user.id_stockis));
    }
  }, []);

  const onFinish = (values) => {
    setStartDate(moment(startDate).format("YYYY-MM-DD"));
    setEndDate(moment(endDate).format("YYYY-MM-DD"));
    let where = `&datefrom=${moment(startDate).format(
      "YYYY-MM-DD"
    )}&dateto=${moment(endDate).format("YYYY-MM-DD")}`;
    if (values !== "") {
      where += `&searchby=${searchby}&q=${
        searchby === "kd_trx" ? btoa(values) : values
      }`;
    }
    setWhere(where);
    dispatch(orderStockisAction(user.id_stockis, `page=1` + where));
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select onChange={(e) => setSearchBy(e)}>
        <Option value="kd_trx">Kode Transaksi</Option>
        <Option value="pembeli">Nama Pembeli</Option>
        <Option value="pembeli_mobile_no">Telepon Pembeli</Option>
      </Select>
    </Form.Item>
  );

  const tempAction = (status, kdTrx, title, loading, desc) => {
    return (
      <Popconfirm
        title={`Anda yakin akan ${desc} transaksi ini ?`}
        onConfirm={(e) =>
          dispatch(
            approveStockisAction(kdTrx, status, {
              id: user.id_stockis,
              where: where,
            })
          )
        }
        okText="Oke"
        cancelText="Batal"
        onCancel={() => {}}
        okButtonProps={{
          loading: loading,
        }}
      >
        <Tag
          style={{ cursor: "pointer" }}
          color={status === 5 ? "#f50" : `#108ee9`}
        >
          {title}
        </Tag>
      </Popconfirm>
    );
  };

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          prefix: "kd_trx",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={6}>
            <Form.Item name="periode" label="Periode">
              {general_helper.dateRange(
                (dates, dateStrings) => {
                  setStartDate(dateStrings[0]);
                  setEndDate(dateStrings[1]);
                },
                false,
                [startDate, endDate]
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item name="any" label="Cari">
              <Search
                addonBefore={prefixSelector}
                placeholder="Tulis sesuatu disini ..."
                enterButton
                onSearch={onFinish}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        style={{ whiteSpace: "nowrap " }}
        scroll={{ x: 400 }}
        bordered={true}
        dataSource={dataOrder}
        loading={loadingOrder}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: false,
          total: parseInt(paginationOrder && paginationOrder.total, 10),
          current: parseInt(
            paginationOrder && paginationOrder.current_page,
            10
          ),
          onChange: (page, pageSize) => {
            dispatch(
              orderStockisAction(user.id_stockis, `page=${page}${where}`)
            );
          },
        }}
      >
        <Column
          title="No"
          dataIndex="no"
          key="no"
          render={(_, record, i) => {
            return general_helper.generateNo(
              i,
              paginationOrder !== undefined ? paginationOrder.current_page : 0
            );
          }}
        />
        <Column
          title="Aksi"
          dataIndex="operation"
          key="operation"
          render={(_, record, i) => {
            let menuAction;
            if (record.status === 0) {
              menuAction = (
                <Space size="middle">
                  {tempAction(
                    1,
                    record.kd_trx,
                    "Konfirmasi",
                    loadingApprove,
                    "mengkonfirmasi"
                  )}
                  {tempAction(
                    5,
                    record.kd_trx,
                    "Tolak",
                    loadingCancel,
                    "menolak"
                  )}
                </Space>
              );
            } else {
              menuAction = (
                <Space size="middle">
                  {record.status === 3 ? (
                    <Tag
                      onClick={(e) => {
                        setKodeTrx(record.kd_trx);
                        setTimeout(() => {
                          dispatch(
                            sendCodeAction(
                              record.kd_trx,
                              {
                                id: user.id_stockis,
                                where: where,
                              },
                              (par) => {
                                setIsModal(par);
                              }
                            )
                          );
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      color="#108ee9"
                    >
                      {kodeTrx === record.kd_trx && loadingApprove
                        ? "loading ...."
                        : "Ambil Barang"}
                    </Tag>
                  ) : record.status === 5 ? (
                    <Tag style={{ cursor: "not-allowed" }} color="orange">
                      Ditolak
                    </Tag>
                  ) : (
                    <Tooltip title="anda belum bisa mengambil barang ini">
                      <Tag style={{ cursor: "not-allowed" }} color="purple">
                        Ambil Barang
                      </Tag>
                    </Tooltip>
                  )}
                </Space>
              );
            }

            return menuAction;
          }}
        />
        <ColumnGroup title="Pembeli">
          <Column title="Nama" dataIndex="pembeli" key="pembeli" />
          <Column
            title="Telepon"
            dataIndex="pembeli_mobile_no"
            key="pembeli_mobile_no"
          />
        </ColumnGroup>
        <Column
          title="Tanggal"
          dataIndex="created_at"
          key="created_at"
          render={(_, record) => {
            return moment(record.created_at).format("LLL");
          }}
        />
        <ColumnGroup title="Kode">
          <Column
            title="Resi"
            dataIndex="resi"
            key="resi"
            render={(_, record, i) => {
              return record.resi === null ? "-" : record.resi;
            }}
          />
          <Column title="Transaksi" dataIndex="kd_trx" key="kd_trx" />
        </ColumnGroup>
        <ColumnGroup title="Pembayaran">
          <Column
            title="Metode"
            dataIndex="metode_pembayaran"
            key="metode_pembayaran"
          />

          <Column
            title="Total"
            dataIndex="grand_total"
            key="grand_total"
            align="right"
            render={(_, record) => {
              return general_helper.toRp(
                parseFloat(record.grand_total !== null ? record.grand_total : 0)
              );
            }}
          />
        </ColumnGroup>

        <ColumnGroup title="Status">
          <Column
            title="Pembelian"
            dataIndex="status"
            key="status"
            render={(_, record, i) => {
              return general_helper.labelStatusPembelian(record.status);
            }}
          />
          <Column
            title="Pengambilan"
            dataIndex="status_pengambilan"
            key="status_pengambilan"
            render={(_, record, i) => {
              return general_helper.labelStatusPengambilan(
                record.status_pengambilan
              );
            }}
          />
        </ColumnGroup>
      </Table>
      {isModal && (
        <Modal
          title={`Konfirmasi #${kodeTrx}`}
          visible={isModal}
          onCancel={(e) => {
            setIsModal(false);
            setKodeTrx("");
          }}
          footer={null}
        >
          <Form
            form={form1}
            layout="vertical"
            onFinish={(e) => {
              dispatch(
                approveCodeAction(
                  kodeTrx,
                  e,
                  {
                    id: user.id_stockis,
                    where: where,
                  },
                  (par) => setIsModal(!par)
                )
              );
            }}
          >
            <Alert
              banner
              message="tekan enter untuk menyimpan"
              type="warning"
            />
            <br />
            <Spin spinning={loadingApprove}>
              <Form.Item
                label="Kode Pengambilan"
                hasFeedback
                name="kode_ambil"
                rules={[
                  { required: true, message: "Tidak Boleh Kosong" },
                  {
                    pattern: new RegExp(/^[0-9]*$/),
                    message: "Harus Berupa Angka",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Spin>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default IndexOrderStockis;
