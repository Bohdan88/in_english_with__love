import React from "react";
import { Form } from "semantic-ui-react";
import "./style.scss";

const FormInput = ({ styleVal, error, type, value, onChange }) => {
  // console.log(error)
  const isError = error && error.message && error.message.includes(value);
  // console.log(isError,'isError')
  return (
    <Form.Field>
      <label className="form-label">{value && value.toUpperCase()}</label>
      <Form.Input
        error={isError ? { content: error.message, pointing: "below" } : false}
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
