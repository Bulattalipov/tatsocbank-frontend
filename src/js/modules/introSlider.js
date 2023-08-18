/* eslint-disable no-unused-vars */
import Swiper, {
  Pagination,
  Thumbs,
  Autoplay,
} from 'swiper/swiper-bundle';

Swiper.use([Pagination, Autoplay, Thumbs]);

export default () => {
  const slider = document.querySelector('.intro__categories');
  const sliderThumb = document.querySelector('.intro__container');
  const imgs = Array.from(document.querySelectorAll('.intro__img'));

  if (!slider) return;

  const sliderIntroNav = new Swiper(slider, {
    speed: 500,
    slidesPerView: 5,
    spaceBetween: 8,
    allowTouchMove: false
  });

  const sliderIntro = new Swiper(sliderThumb, {
    speed: 500,
    slidesPerView: 'auto',
    spaceBetween: 100,
    allowTouchMove: false,
    thumbs: {
      swiper: sliderIntroNav,
    },
    pagination: {
      el: slider.querySelector('.page-swiper-pagination'),
      type: 'bullets',
      clickable: true,
    },
    breakpoints: {
      280: {
        allowTouchMove: true,
      },
      1281: {
        allowTouchMove: false,
      },
    },
    on: {
      slideChange: (swiper) => {
        imgs.forEach((img) => img.classList.remove('is-active'));
        imgs[swiper.realIndex].classList.add('is-active');

        let header = document.querySelector('header');

        if (imgs[swiper.realIndex].dataset.colorText === 'white') {
          if (!header.classList.contains('is-white')) {
            header.classList.add('is-white');
          }
        }
        
        if (imgs[swiper.realIndex].dataset.colorText === 'dark') {
          if (header.classList.contains('is-white')) {
            header.classList.remove('is-white');
          }
        }

      },
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  let sliderSlides = slider.querySelectorAll('.intro__categories-item');
  sliderSlides.forEach((item, i) => {
    item.addEventListener('mousedown', (e) => {
      console.log(i);
      sliderIntro.slideTo(i);
    });
  });

  const contents = document.querySelectorAll('.intro__item');
    contents[0].classList.add('active');

    sliderIntro.on('slideChange', () => {
        contents.forEach(item => item.classList.remove('active'));
        contents[sliderIntro.activeIndex] ? contents[sliderIntro.activeIndex].classList.add('active') : null;
    })
};
