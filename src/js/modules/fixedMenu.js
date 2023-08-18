/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/extensions */
/* eslint-disable object-shorthand */
import gsap from 'gsap';
import { disableScroll, enableScroll } from '../helpers/disableScroll';
// import Draggable from '../../assets/js/gsap-bonus/Draggable.js';

// gsap.registerPlugin(Draggable);

export default () => {
  const menuBtn = document.querySelector('.js-fixed-menu');
  const closeBtn = document.querySelector('.js-mobile-menu-close');
  const menu = document.querySelector('.js-mobile-menu');
  const DURATION = 0.2;
  const timeline = gsap.timeline({
    paused: true,
    reverse: true,
  });
  let opened = false;

  if(!menuBtn) return;
  if(!closeBtn) return;

  gsap.set('.mobile-menu__inner', { yPercent: 100 });

  timeline
    .to(menu, {
      opacity: 1,
      visibility: 'visible',
      duration: DURATION,
    })
    .to('.mobile-menu__inner', {
      yPercent: 0,
      duration: DURATION,
      clearProps: 'all',
    }, '-=0.1');

  closeBtn.addEventListener('click', () => {
    enableScroll();

    timeline.reverse();
    menuBtn.classList.remove('is-active');
    opened = false;
  });

  menuBtn.addEventListener('click', () => {
    switch (opened) {
      case false:
        disableScroll();

        menuBtn.classList.add('is-active');
        timeline.play();
        opened = true;
        break;
      case true:
        enableScroll();

        menuBtn.classList.remove('is-active');
        timeline.reverse();
        opened = false;
        break;
      default:
        break;
    }
  });

  // Draggable.create('.mobile-menu__inner', {
  //   trigger: '.mobile-menu__swipe-line',
  //   type: 'y',
  //   bounds: '.page-wrapper',
  //   dragResistance: 0.1,
  //   onDrag: function () {
  //     if (this.y >= 30) {
  //       enableScroll();

  //       timeline.reverse();
  //       menuBtn.classList.remove('is-active');
  //       opened = false;
  //     }
  //   },
  // });
};
