/* eslint-disable no-unused-vars */
import Swiper, { Navigation, fadeEffect} from 'swiper/swiper-bundle';

Swiper.use([Navigation, fadeEffect]);

export default () => {
  const swipers = Array.from(document.querySelectorAll('.news-and-article__slider'));

  swipers.forEach((slider) => {
    const obj = {
      speed: 500,
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: slider.closest('.news-and-article__slider-wrapper').querySelector('.js-next-slide'),
        prevEl: slider.closest('.news-and-article__slider-wrapper').querySelector('.js-prev-slide')
      },
      // effect: 'fade',
      // fadeEffect: {
      //   crossFade: true
      // },
      breakpoints: {
        768: {
          spaceBetween: 1,
        }
      },
    };

    const instance = new Swiper(slider, obj);
  });
};
