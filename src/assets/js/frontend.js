/* eslint-disable */

function manipulation() {
  var
      windowWidth = $(window).innerWidth(),
      containerWidth = $('.page__container').width();

  if (windowWidth > containerWidth && containerWidth != 0) {
      if (windowWidth >= 1024)
          offset = (windowWidth - containerWidth) / 2;
      else
          offset = 30;

      /*$('.jsMarginOffset').css({
          'margin-right': -offset + "px",
          'margin-left': -offset + "px"
      });

      $('.jsPaddingLeftOffset').css({
          'padding-right': offset + "px",
          'padding-left': offset + "px"
      });*/

      $('.privateContentSlider.owl-theme .owl-nav').css({
          'padding-right': offset + "px",
          'padding-left': offset + "px"
      });
  }
}

function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
