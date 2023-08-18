/* eslint-disable no-shadow */

import Modal from "./Modal";

export default () => {
  const modal = new Modal({
    isOpen: (modal) => {
    },
    isClose: (modal) => {
    },
  });

  window.tatsocbank_api.modal = modal;
};
