import { Row, PageHeader } from "antd";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import CardNews from "../../components/news/cardNews";
const News = () => {
  const [state] = useAppState();
  const [arrNews, setArrNews] = useState([]);

  useEffect(() => {}, [state]);

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Informasi Terbaru"
    >
      <Row gutter={16}>
        <CardNews
          callback={(res) => {
            setArrNews(res);
          }}
          isLoadMore={true}
          pagePer={8}
        />
      </Row>
    </PageHeader>
  ) : (
    <Row gutter={16}>
      <CardNews
        callback={(res) => {
          setArrNews(res);
        }}
        isLoadMore={true}
        pagePer={8}
      />
    </Row>
  );
};

export default News;
