import {
  Table,
  Select,
  Row,
  Col,
  Popconfirm,
  Space,
  Input,
  Form,
  message,
  Tooltip,
} from "antd";
const { Column, ColumnGroup } = Table;
import { CopyOutlined } from "@ant-design/icons";
import Helper from "../../../helper/general_helper";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../../action/baseAction";
import authAction from "../../../action/auth.action";
const Option = Select.Option;
const Search = Input.Search;
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  approveStockisAction,
  orderStockisAction,
} from "../../../redux/actions/stockis.action";
import general_helper from "../../../helper/general_helper";

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
  const [loading, setLoading] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [arrDatum, setArrDatum] = useState([]);
  const [meta, setMeta] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    loadingApprove,
    loadingCancel,
    loadingTake,
    loadingOrder,
    dataOrder,
    paginationOrder,
  } = useSelector((state) => state.stockisReducer);
  const user = authAction.getUser();

  useEffect(() => {
    dispatch(orderStockisAction(user.id_stockis));
  }, []);

  const onFinish = (values) => {
    let where = ``;
    if (values !== "") {
      where += `page=1&searchby=${searchby}&q=${
        searchby === "kd_trx" ? btoa(values) : values
      }`;
    }
    setWhere(where);
    dispatch(orderStockisAction(user.id_stockis, where));
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
        onConfirm={(e) => dispatch(approveStockisAction(kdTrx, status))}
        okText="Oke"
        cancelText="Batal"
        onCancel={() => {}}
        okButtonProps={{
          loading: loading,
        }}
      >
        <a>{title}</a>
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
        loading={loadingOrder || loadingApprove || loadingCancel || loadingTake}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: false,
          total: parseInt(paginationOrder && paginationOrder.total, 10),
          current: parseInt(
            paginationOrder && paginationOrder.current_page,
            10
          ),
          onChange: (page, pageSize) => {
            console.log(page);
            console.log(pageSize);
            dispatch(orderStockisAction(user.id_stockis, `page=${page}`));
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
          title="#"
          key="action"
          render={(_, record, i) => {
            Object.assign(record, { visible: false });
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
                    2,
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
                    tempAction(
                      3,
                      record.kd_trx,
                      "Ambil Barang",
                      loadingTake,
                      "mengambil barang pada"
                    )
                  ) : (
                    <Tooltip title="anda belum bisa mengambil barang ini">
                      <a style={{ cursor: "not-allowed" }}>Ambil Barang</a>
                    </Tooltip>
                  )}
                </Space>
              );
            }

            return menuAction;
          }}
        />

        <ColumnGroup title="Status">
          <Column
            title="Pengambilan"
            dataIndex="status"
            key="status"
            render={(_, record, i) => {
              let status = "";
              if (record.status === 0) {
                status = "Belum Diambil";
              } else {
                status = "Telah Diambil";
              }
              return status;
            }}
          />
          <Column
            title="Pembelian"
            dataIndex="status_pembelian"
            key="status_pembelian"
            render={(_, record, i) => {
              let status = "";
              if (record.status_pengambilan === 0) {
                status = "Menuggu Pembayaran";
              } else if (record.status_pengambilan === 1) {
                status = "Diproses";
              } else if (record.status_pengambilan === 2) {
                status = "Dikirim";
              } else if (record.status_pengambilan === 3) {
                status = "Diterima Stokis";
              } else {
                status = "Selesai";
              }
              return status;
            }}
          />
        </ColumnGroup>
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
        <ColumnGroup title="Pembeli">
          <Column title="Nama" dataIndex="pembeli" key="pembeli" />
          <Column
            title="Telepon"
            dataIndex="pembeli_mobile_no"
            key="pembeli_mobile_no"
          />
        </ColumnGroup>
        <ColumnGroup title="Pembayaran">
          <Column
            title="Metode"
            dataIndex="metode_pembayaran"
            key="metode_pembayaran"
          />
          <Column
            title="Ongkir"
            dataIndex="ongkos_kirim"
            key="ongkos_kirim"
            align="right"
            render={(_, record) => {
              return general_helper.toRp(
                parseFloat(
                  record.ongkos_kirim !== null ? record.ongkos_kirim : 0
                )
              );
            }}
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
        <Column
          title="Tanggal"
          dataIndex="created_at"
          key="created_at"
          render={(_, record) => {
            return moment(record.created_at).format("LLL");
          }}
        />
      </Table>
    </div>
  );
};

export default IndexOrderStockis;
