import { PageHeader } from "antd";
import CreateMitra from "../../components/mitra/CreateMitra";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexMitra = () => {
  const [state] = useAppState();
  return <CreateMitra />;
};

export default IndexMitra;
