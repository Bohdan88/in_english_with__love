import React from "react";
import { Form } from "semantic-ui-react";
import "./style.scss";

const FormInput = ({ styleVal, error, type, value, onChange }) => {
  const isError =
    error &&
    error.message &&
    (error.message.toUpperCase().includes(value.toUpperCase()) ||
      error.message.toUpperCase().includes(type.toUpperCase()));

  const contentMessage =
    isError && error
      ? error.message.includes("password")
        ? "The password is invalid."
        : error.message
      : null;

  return (
    <Form.Field>
      <label className="form-label">{value && value.toUpperCase()}</label>
      <Form.Input
        error={isError ? { content: contentMessage, pointing: "below" } : false}
        name={value}
        type={type}
        className={`form-input ${isError ? styleVal : ""}`}
        placeholder={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

export default FormInput;
