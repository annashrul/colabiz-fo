import { PageHeader } from "antd";
import CreateStockis from "../../components/stockis/CreateStockis";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexStockis = () => {
  const [state] = useAppState();

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Stokis"
    >
      <CreateStockis />
    </PageHeader>
  ) : (
    <CreateStockis />
  );
};

export default IndexStockis;
