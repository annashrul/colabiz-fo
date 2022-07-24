import ListProduct from "../../components/pembelian/ListProduct";
import { PageHeader } from "antd";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexPembelian = () => {
  const [state] = useAppState();

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      // onBack={() => Router.back()}
      title="Pembelian Produk"
    >
      <ListProduct />
    </PageHeader>
  ) : (
    <ListProduct />
  );
};

export default IndexPembelian;
