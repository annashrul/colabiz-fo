import CreateStockis from "../../components/stockis/CreateStockis";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexStockis = () => {
  const [state] = useAppState();

  return <CreateStockis />;
};

export default IndexStockis;
