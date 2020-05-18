/* a modal to display  either an error or confirmation*/

import Swal from "sweetalert2";
import { CONFIRMATION_REMOVE_ALERT } from "../constants/shared";

const fireAlert = (state, values, error = null, type) => {
  switch (type) {
    case CONFIRMATION_REMOVE_ALERT:
      return Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        position: "top-end",
      });
    default:
      Swal.fire({
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
      setTimeout(() => Swal.close(), 4000);
  }
};

export default fireAlert;
