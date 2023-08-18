import Swiper, {
} from 'swiper/swiper-bundle';

Swiper.use([]);

export default () => {
  if (window.matchMedia('(max-width: 992px)').matches) {
    const sliders = document.querySelectorAll('.js-utility-slider');

    sliders.forEach(slider => {
      if(!slider) return;

      const swiper = new Swiper(slider, {
        slidesPerView: "auto",
        speed: 500,
        spaceBetween: 14
      })
    })
  }
}
