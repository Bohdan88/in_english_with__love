/*  a function which 
    converts values to dropdown options
    example => "a" => {text: "a", value: "a", key: "a"}
*/

const transformToOptions = (arr) => {
  return arr && arr[0] !== undefined
    ? arr.map((el) => ({
        key: el,
        text: el,
        value: el,
      }))
    : [];
};

export default transformToOptions;
