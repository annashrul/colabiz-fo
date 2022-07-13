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
import React, { useEffect, useState } from "react";
import authAction from "../../action/auth.action";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { reportPurchaseAction } from "../../redux/actions/report.action";
import general_helper from "../../helper/general_helper";
moment.locale("id");
const { Column, ColumnGroup } = Table;
const Option = Select.Option;
const Search = Input.Search;
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
const PurchaseReport = () => {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [searchby, setSearchBy] = useState("kd_trx");
  const [where, setWhere] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loadingPurchase, dataPurchase, paginatioPurchase } = useSelector(
    (state) => state.reportReducer
  );
  const user = authAction.getUser();
  useEffect(() => {
    dispatch(reportPurchaseAction(user.id, `&page=1`));
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

    // let where = ``;
    // if (values !== "") {
    //   where += `page=1&searchby=${searchby}&q=${
    //     searchby === "kd_trx" ? btoa(values) : values
    //   }`;
    // }
    setWhere(where);
    dispatch(reportPurchaseAction(user.id, where));
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
        dataSource={dataPurchase}
        loading={loadingPurchase}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: false,
          total: parseInt(paginatioPurchase && paginatioPurchase.total, 10),
          current: parseInt(
            paginatioPurchase && paginatioPurchase.current_page,
            10
          ),
          onChange: (page, pageSize) => {
            dispatch(reportPurchaseAction(user.id, `page=${page}`));
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
              paginatioPurchase !== undefined
                ? paginatioPurchase.current_page
                : 0
            );
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

export default PurchaseReport;
