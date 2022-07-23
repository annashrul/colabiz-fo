// import PhoneInput from "react-phone-number-input";
import { useState, useEffect } from "react";
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from "react-phone-number-input";
import general_helper from "../helper/general_helper";
const HandphoneComponent = ({ callback, val }) => {
  const [noHp, setNoHp] = useState();

  useEffect(() => {
    setTimeout(() => {
      console.log(noHp);
      if (noHp !== undefined) callback(noHp.replaceAll("+", ""));
    }, 100);
  }, [noHp]);

  useEffect(() => {
    if (val !== undefined) {
      setNoHp("+" + general_helper.checkNo(val));
    }
  }, []);

  return (
    <PhoneInput
      international
      defaultCountry="ID"
      placeholder="81223165XXXX"
      countryCallingCodeEditable={false}
      value={noHp}
      error={
        noHp
          ? isValidPhoneNumber(noHp)
            ? undefined
            : "Invalid phone number"
          : "Phone number required"
      }
      //   value={noHp}
      onChange={(e) => {
        if (e !== undefined) {
          setNoHp(e);
        }
        // setNoHp(e);
      }}
    />
  );
};

export default HandphoneComponent;
