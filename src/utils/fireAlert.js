/* a modal to display  either an error or confirmation*/

import Swal from "sweetalert2";
import { CONFIRMATION_ALERT } from "../constants/alertContent";

const fireAlert = ({ state, type, values, error = null }) => {
  switch (type) {
    case CONFIRMATION_ALERT:
      return Swal.fire({
        icon: values.icon,
        title: values.title,
        // "Are you sure?",
        // text: "You won't be able to revert this!",
        text: values.text,
        // icon: "warning",

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: values.cancelButtonText,
        confirmButtonText: values.confirmButton,
        // "Yes, delete it!",
        position: "top-end",
      });
    default:
      setTimeout(() => Swal.close(), 4000);
      return Swal.fire({
        icon: values.icon
          ? state
            ? values.icon.success
            : values.icon.error
          : "",
        heightAuto: false,
        title: values.title
          ? state
            ? values.title.success
            : values.title.error
          : "",
        text: values.text
          ? state
            ? values.text.success
            : error
            ? error
            : values.text.error
          : "",
        customClass: {
          confirmButton: "ui green basic button",
          container: "alert-container-class",
        },
        position: "top-end",
        popup: "swal2-show",
        className: "admit-sweet-alert",
        reverseButtons: true,
      });
  }
};

export default fireAlert;
