import {
  Col,
  Button,
  Message,
  Row,
  Skeleton,
  Card,
  Empty,
  Input,
  Form,
  Badge,
} from "antd";
import React, { useEffect, useState } from "react";
import { handleGet } from "../../action/baseAction";
import Router from "next/router";
import Helper from "../../helper/general_helper";
import { useAppState } from "../shared/AppProvider";
const Search = Input.Search;

const CardNews = ({ callback, isLoadMore = true, pagePer = 4 }) => {
  const [arrNews, setArrNews] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [font, setFont] = useState("14px");
  const [state] = useAppState();
  const [loading, setLoading] = useState(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const dummyData = ["a", "a", "a", "a"];
  const [perpage, setPerpage] = useState(pagePer);
  let counterPerpage = 2;

  const loadMore = () => {
    let total = parseInt(pagination.total, 10);
    if (total === perpage || perpage > total) {
      Message.info("data berita tidak tersedia lagi");
    } else {
      setLoadingLoadMore(true);
      let perpages = perpage + counterPerpage;
      setPerpage(perpages);
      handleLoadNews(perpages);
    }
  };
  useEffect(() => {
    handleLoadNews(perpage);
  }, [perpage]);
  useEffect(() => {
    if (state.mobile) {
      setFont("80%");
    }
  }, [state]);

  const handleLoadNews = async (pages, where = "") => {
    await handleGet(
      `content?&page=1&perpage=${pages}&status=1${where}`,
      (res, status, msg) => {
        if (status) {
          setPagination(res.pagination);
          setArrNews(res.data);
          callback(res);
        } else {
          setArrNews([]);
          callback([]);
        }

        setTimeout(() => setLoadingLoadMore(false), 300);
        setLoading(false);
      }
    );
  };
  return loading ? (
    dummyData.map((val, key) => {
      <Col key={key} xs={12} sm={8} md={6} className="mb-2">
        <Card>
          <Skeleton />
        </Card>
      </Col>;
    })
  ) : (
    <Col xs={24} sm={24} md={24}>
      <Row gutter={4}>
        {isLoadMore && (
          <Col xs={24} sm={24} md={24}>
            <Form.Item name="any" label="">
              <Search
                placeholder="Tulis sesuatu disini ..."
                enterButton
                onSearch={(e) => {
                  if (e === "" || e === undefined) {
                    handleLoadNews(perpage);
                  } else {
                    handleLoadNews(perpage, `&q=${e}`);
                  }
                }}
              />
            </Form.Item>
          </Col>
        )}

        {arrNews.length > 0 ? (
          arrNews.map((val, key) => {
            let desc = Helper.rmHtml(val.caption);
            let lengthIsMobile = state.mobile ? 50 : 80;
            if (desc.length > lengthIsMobile) {
              desc = desc.substr(0, lengthIsMobile) + " ..";
            }
            return (
              <Col
                key={key}
                xs={12}
                sm={8}
                md={6}
                className="mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  Router.push(`/news/${val.id}`);
                }}
              >
                <Badge.Ribbon text={val.category} size="small">
                  <Card
                    style={{ height: !state.mobile ? "330px" : "260px" }}
                    title={
                      <small style={{ fontSize: font }}>{val.title}</small>
                    }
                    hoverable
                    cover={
                      <img
                        style={{ height: !state.mobile ? "180px" : "105px" }}
                        alt="example"
                        src={val.picture}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = Helper.imgDefault;
                        }}
                      />
                    }
                  >
                    <small style={{ fontSize: font }}>{desc}</small>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })
        ) : isLoadMore ? (
          <Col xs={24} sm={24} md={24}>
            <Empty />
          </Col>
        ) : (
          ""
        )}
        {isLoadMore &&
          arrNews.length > 0 &&
          parseInt(pagination.total, 10) > pagePer && (
            <Col xs={24} sm={24} md={24}>
              <Button
                loading={loadingLoadMore}
                block={true}
                type="primary"
                onClick={(e) => loadMore()}
              >
                Loadmore
              </Button>
            </Col>
          )}
      </Row>
    </Col>
  );
};

export default CardNews;
