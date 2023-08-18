
export default () => {
  const sliderBtnsItems = document.querySelectorAll(".slider-btns");

  if(sliderBtnsItems.length === 0) return;

  sliderBtnsItems.forEach(item => {
    if(item.querySelector('.swiper-button-lock')) {
      item.classList.add('hide');
    }
  });
}
