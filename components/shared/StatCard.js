import { Button, Card, Col, Row } from "antd";

import PropTypes from "prop-types";
import { useAppState } from "./AppProvider";

const StatCard = ({ type, title, value, icon, color, clickHandler, col }) => {
  const [state] = useAppState();
  let before = null,
    after = null;

  const cardIcon = (
    <Col xs={4} md={3}>
      <Button
        shape="circle"
        size={"large"}
        type="primary"
        style={{ backgroundColor: color, borderColor: color }}
        className={
          type !== "fill"
            ? `${state.direction === "rtl" ? "ml-2" : "mr-2"}`
            : null
        }
        onClick={clickHandler}
      >
        {icon}
      </Button>
    </Col>
  );

  if (icon) {
    type === "fill" ? (after = cardIcon) : (before = cardIcon);
  }

  return (
    <Card style={type === "fill" ? { backgroundColor: color } : null}>
      <Row type="flex" align="middle" justify="start">
        {before}
        <Col xs={20} md={21}>
          {state.mobile ? (
            <h6 className={`mb-0 ${type === "fill" ? "text-white" : null}`}>
              {value}
            </h6>
          ) : (
            <h5 className={`mb-0 ${type === "fill" ? "text-white" : null}`}>
              {value}
            </h5>
          )}
          <small className={type === "fill" ? "text-white-50" : null}>
            {title}
          </small>
        </Col>
        <span className="mr-auto" />
        {after}
      </Row>
    </Card>
  );
};

StatCard.propTypes = {
  type: PropTypes.any,
  title: PropTypes.any,
  value: PropTypes.any,
  icon: PropTypes.element,
  color: PropTypes.any,
};

export default StatCard;
