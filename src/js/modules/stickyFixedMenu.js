// import Sticky from "sticky-js";
import Sticky from "sticky-js";

export default () => {
  if (window.matchMedia('(min-width: 1200px)').matches) {
    var sticky = new Sticky('.js-sticky');
    sticky.options.marginTop = 130;
    window.tatsocbank_api.sticky = sticky;
  }
}
