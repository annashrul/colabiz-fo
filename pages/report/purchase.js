import { Table, Select, Row, Col, Input, Form } from "antd";
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
const IndexPurchaseReport = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [searchby, setSearchBy] = useState("kd_trx");
  const [where, setWhere] = useState("");
  const [form] = Form.useForm();
  const { loadingPurchase, dataPurchase, paginationPurchase } = useSelector(
    (state) => state.reportReducer
  );
  const user = authAction.getUser();
  useEffect(() => {
    dispatch(reportPurchaseAction(user.id, `&page=1`));
  }, []);
  console.log(dataPurchase);

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
  const datas = [{ id: "sad" }];

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
          total: parseInt(paginationPurchase && paginationPurchase.total, 10),
          current: parseInt(
            paginationPurchase && paginationPurchase.current_page,
            10
          ),
          onChange: (page, pageSize) => {
            dispatch(reportPurchaseAction(user.id, `&page=${page}`));
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
              paginationPurchase !== undefined
                ? paginationPurchase.current_page
                : 0
            );
          }}
        />

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
        <ColumnGroup title="Stokis">
          <Column title="Nama" dataIndex="stockis" key="stockis" />
          <Column
            title="Telepon"
            dataIndex="stockis_mobile_no"
            key="stockis_mobile_no"
          />
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

export default IndexPurchaseReport;
