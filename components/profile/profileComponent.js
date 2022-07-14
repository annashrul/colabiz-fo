import { Col, Row } from "antd";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { HomeOutlined, BankOutlined } from "@ant-design/icons";
import FormComponent from "./formComponent";
import moment from "moment";
import StatCard from "../shared/StatCard";
import ProfileCard from "./profileCard";

moment.locale("id");
const ProfileComponent = () => {
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [bank, setBank] = useState({});
  const [address, setAddress] = useState({});
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    const users = authAction.getUser();
    const banks = authAction.getBank();
    const adresses = authAction.getAddress();
    setUser(users);
    setBank(banks);
    setAddress(adresses);
  }, [state, showForm]);

  return (
    <div>
      <ProfileCard
        callback={() => {
          setShowForm(true);
        }}
      />

      <Row gutter={8}>
        <Col md={12} xs={24} sm={12} style={{ marginBottom: "10px" }}>
          <StatCard
            value={bank.bank_name}
            title={`${bank.acc_name}, ${bank.acc_no}`}
            icon={
              <BankOutlined
                style={{
                  fontSize: "20px",
                }}
              />
            }
          />
        </Col>

        <Col md={12} xs={24} sm={12}>
          <StatCard
            value={address.title}
            title={`${address.main_address}, ${address.kecamatan}, ${address.kota}, ${address.provinsi}`}
            icon={
              <HomeOutlined
                style={{
                  fontSize: "20px",
                }}
              />
            }
          />
        </Col>
      </Row>

      <br />
      {showForm && (
        <FormComponent
          isModal={showForm}
          ok={() => {}}
          cancel={() => setShowForm(false)}
          userData={user}
        />
      )}
    </div>
  );
};

export default ProfileComponent;
