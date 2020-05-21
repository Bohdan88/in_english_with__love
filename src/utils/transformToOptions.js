/*  a function which 
    converts values to dropdown options
    example => "a" => {text: "a", value: "a", key: "a"}
*/

const transformToOptions = (arr, parameters = {}) => {
  const { disabled } = parameters;
  return arr && arr[0] !== undefined
    ? arr.map((el) => ({
        key: el,
        text: el,
        value: el,
        disabled: disabled ? true : false,
      }))
    : [];
};

export default transformToOptions;
