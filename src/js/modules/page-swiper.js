/* eslint-disable no-unused-vars */
import { log } from 'console';
import Swiper, { Navigation } from 'swiper/swiper-bundle';

Swiper.use([Navigation]);

export default () => {
  const swipers = Array.from(document.querySelectorAll('.page-swiper'));

  swipers.forEach((slider) => {
    const slidesCount = Number(slider.dataset.slides);
    const slidesGap = Number(slider.dataset.gap);
    const slidesNav = slider.dataset.nav;

    const navigation = slidesNav ? {
      nextEl: slider.closest('.page-swiper-parent').querySelector('.js-next-slide'),
      prevEl: slider.closest('.page-swiper-parent').querySelector('.js-prev-slide'),
    } : false;

    const obj = {
      slidesPerView: slidesCount,
      spaceBetween: slidesGap,
      navigation,
      breakpoints: {
        280: {
          slidesPerView: 1.18,
        },
        768: {
          slidesPerView: 2.1,
        },
        992: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: slidesCount,
        },
      },
    };

    const instance = new Swiper(slider, obj);
  });
};
