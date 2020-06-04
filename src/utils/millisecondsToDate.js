/**
 * Converts milliseconds to date
 *
 */

const convertMillisecondsToDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const day = date.getDate();
  const month = date.toString().slice(4, 7);
  const year = date.getFullYear();

  return `${month} ${day}, ${year} `;
};

export default convertMillisecondsToDate;
