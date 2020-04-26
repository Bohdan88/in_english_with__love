import React from "react";
import { Form } from "semantic-ui-react";
import "./style.scss";

const FormInput = ({ error, type, value, onChange }) => {
  const isError = error && error.message && error.message.includes(value);
  return (
    <Form.Field>
      <label className="form-label">{value && value.toUpperCase()}</label>
      <Form.Input
        error={isError ? { content: error.message, pointing: "below" } : false}
        name={value}
        type={type}
        className={`form-input ${isError ? value : ""}`}
        placeholder={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

export default FormInput;
