import gsap from "gsap";
import SplitText from '../../assets/js/gsap-bonus/SplitText';
import {
  ScrollTrigger
} from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default () => {

  const header = document.querySelector('.header');
  const introContainer = document.querySelector('.intro__container');
  const introCategories = document.querySelector('.intro__categories');


  const timeLine = gsap.timeline({
    paused: true,
    reversed: true
  });

  // gsap.set(introContainer, {
  //   yPercent: 4,
  // });

  timeLine
    .to(header, {
      opacity: 1,
      duration: 1.4
    }, "start")
    .to(introContainer, {
      opacity: 1,
      duration: 1.4
    }, "start")
    .to(introCategories, {
      opacity: 1,
      duration: 1.4
    }, "start")

  timeLine.play();
}
