import { Col, Row, Alert, Modal, Message, Spin } from "antd";
import { useAppState } from "../shared/AppProvider";
import { useState, useEffect } from "react";
import authAction from "../../action/auth.action";
import { HomeOutlined, BankOutlined } from "@ant-design/icons";
import FormComponent from "./formComponent";
import moment from "moment";
import StatCard from "../shared/StatCard";
import ProfileCard from "./profileCard";
import FormAddress from "../address/formAddress";
import { useDispatch, useSelector } from "react-redux";
import { putAction } from "../../redux/actions/address.action";
import FormBank from "../bank/formBank";
import { userDetailAction } from "../../redux/actions/auth.action";
import { putBankMemberAction } from "../../redux/actions/banks.action";
import general_helper from "../../helper/general_helper";

moment.locale("id");
const ProfileComponent = () => {
  const dispatch = useDispatch();
  const [state] = useAppState();
  const [user, setUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showFormBank, setShowFormBank] = useState(false);
  const [showFormAddress, setShowFormAddress] = useState(false);
  const { loadingStrore } = useSelector((state) => state.addressReducer);
  const { loadingBankMember, dataBankMember } = useSelector(
    (state) => state.banksReducer
  );

  const { loadingUserDetail, dataUserDetail } = useSelector(
    (state) => state.authUserReducer
  );

  useEffect(() => {
    const users = authAction.getUser();
    setUser(users);
  }, [state, showForm]);

  useEffect(() => {
    setTimeout(() => {
      if (user.id !== undefined) {
        dispatch(userDetailAction(user.id));
      }
    }, 100);
  }, [user]);

  return (
    <div>
      <ProfileCard
        callback={() => {
          setShowForm(true);
        }}
      />

      <Row gutter={8}>
        <Col md={12} xs={24} sm={12} style={{ marginBottom: "10px" }}>
          <Alert banner message="Klik Icon berwarna biru untuk mengubah" />
          <Spin
            spinning={loadingUserDetail && dataUserDetail.bank === undefined}
          >
            <StatCard
              clickHandler={() => setShowFormBank(true)}
              value={
                dataUserDetail.bank === undefined
                  ? ""
                  : dataUserDetail.bank.bank_name
              }
              title={
                dataUserDetail.bank === undefined
                  ? ""
                  : `${dataUserDetail.bank.acc_name}, ${dataUserDetail.bank.acc_no}`
              }
              icon={
                <BankOutlined
                  style={{
                    fontSize: "20px",
                  }}
                />
              }
            />
          </Spin>
        </Col>

        <Col md={12} xs={24} sm={12}>
          <Alert banner message="Klik Icon berwarna biru untuk mengubah" />
          <Spin
            spinning={loadingUserDetail && dataUserDetail.address === undefined}
          >
            <StatCard
              clickHandler={() => {
                setShowFormAddress(true);
              }}
              value={
                dataUserDetail.address === undefined
                  ? ""
                  : dataUserDetail.address.title
              }
              title={
                dataUserDetail.address === undefined
                  ? ""
                  : `${dataUserDetail.address.main_address}, ${dataUserDetail.address.kecamatan}, ${dataUserDetail.address.kota}, ${dataUserDetail.address.provinsi}`
              }
              icon={
                <HomeOutlined
                  style={{
                    fontSize: "20px",
                  }}
                />
              }
            />
          </Spin>
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

      {dataUserDetail.bank !== undefined && showFormBank && (
        <Modal
          centered
          title="Ubah Bank"
          visible={showFormBank}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
          footer={null}
        >
          <Spin spinning={loadingBankMember}>
            <FormBank
              dataOld={dataUserDetail.bank}
              callback={(e, data) => {
                if (e === "cancel") {
                  setShowFormBank(false);
                } else {
                  dispatch(
                    putBankMemberAction(
                      data,
                      dataUserDetail.bank.id,
                      user.id,
                      (res) => {
                        if (res) {
                          Message.success("bank berhasil disimpan").then(() => {
                            setShowFormBank(false);
                          });
                          // setShowFormBank(false);
                        }
                      }
                    )
                  );
                }
              }}
            />
          </Spin>
        </Modal>
      )}

      {dataUserDetail.address !== undefined && showFormAddress && (
        <Modal
          centered
          title="Ubah Alamat"
          visible={showFormAddress}
          closable={false}
          destroyOnClose={true}
          maskClosable={false}
          footer={null}
        >
          <Spin spinning={loadingStrore}>
            <FormAddress
              dataOld={authAction.getAddress()}
              callback={(e, data) => {
                if (e === "cancel") {
                  setShowFormAddress(false);
                } else {
                  console.log(data);
                  let newData = {
                    id_member: user.id,
                    ismain: 1,
                    kd_kec: data.kd_kec,
                    kd_kota: data.kd_kota,
                    kd_prov: data.kd_prov,
                    main_address: data.main_address,
                    no_hp: general_helper.checkNo(data.no_hp),
                    penerima: data.penerima,
                    title: data.title,
                  };
                  dispatch(
                    putAction(
                      dataUserDetail.address.id,
                      newData,
                      user.id,
                      (res) => {
                        if (res) {
                          Message.success("alamat berhasil disimpan").then(
                            () => {
                              setShowFormAddress(false);
                            }
                          );
                        }
                      }
                    )
                  );
                }
              }}
              isFull={true}
            />
          </Spin>
        </Modal>
      )}
    </div>
  );
};

export default ProfileComponent;
