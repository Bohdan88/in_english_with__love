/* a modal to display  either an error or confirmation*/

import Swal from "sweetalert2";

const fireAlert = (state, values, error = null) => {
  Swal.fire({
    icon: state ? values.icon.success : values.icon.error,
    heightAuto: false,
    title: state ? values.title.success : values.title.error,
    text: state ? values.text.success : error ? error : values.text.error,
    customClass: {
      confirmButton: "ui green basic button",
      container: "alert-container-class",
    },
    position: "top-end",
    popup: "swal2-show",
    className: "admit-sweet-alert",
  });

  setTimeout(() => Swal.close(), 4000);
};

export default fireAlert;
