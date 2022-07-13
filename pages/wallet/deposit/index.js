import FormDeposit from "../../../components/wallet/FormDeposit";
import { PageHeader } from "antd";
import Router from "next/router";
import { useAppState } from "../../../components/shared/AppProvider";
import React from "react";

const Withdraw = () => {
  const [state] = useAppState();
  return <FormDeposit />;
};

export default Withdraw;
