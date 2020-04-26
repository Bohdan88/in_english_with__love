import React from "react";
import { Image } from "semantic-ui-react";
import { GOOGLE_LINK, FACEBOOK_LINK } from "../../../constants/shared";
import "./style.scss";

const AnotherAccount = ({ actionType }) => {
  return (
    <div className="container-another-account">
      <p className="another-account"> {actionType} WITH ANOTHER ACCOUNT: </p>
      <div className="contaniner-social-assets">
        <Image className="social-image-google" src={GOOGLE_LINK} />
        <Image className="social-image-facebook" src={FACEBOOK_LINK} />
      </div>
    </div>
  );
};

export default AnotherAccount;
