import Swiper, {
} from 'swiper/swiper-bundle';

Swiper.use([]);

export default () => {
  if (window.matchMedia('(max-width: 1200px)').matches) {
    const sliders = document.querySelectorAll('.js-popular-slider');

    sliders.forEach(slider => {
      if(!slider) return;

      const swiper = new Swiper(slider, {
        slidesPerView: "auto",
        spaceBetween: 14
      })
    })
  }
}
