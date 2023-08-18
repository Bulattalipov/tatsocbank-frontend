import Swiper, {
} from 'swiper/swiper-bundle';

Swiper.use([]);

export default () => {
  if (window.matchMedia('(max-width: 1200px)').matches) {
    const sliders = document.querySelectorAll('.more-from-bank__swiper');

    sliders.forEach(slider => {
      if(!slider) return;

      const swiper = new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 14,
        breakpoints: {
          280: {
            slidesPerView: 1.18,
          },
          768: {
            slidesPerView: 2.1,
          },
          992: {
            slidesPerView: 3,
          }
        },
      })
    })
  }
}
