import React from "react";
import {
  PasswordChangeForm,
  UpdateUserProfile,
  DeleteAccount,
  SignInTypeManagement,
} from "../ChildComponents";

const EditAccount = () => {
  return (
    <>
      <UpdateUserProfile />
      <PasswordChangeForm />
      <SignInTypeManagement />
      <DeleteAccount />
    </>
  );
};

export default EditAccount;
