import gsap from "gsap";
import SplitText from '../../assets/js/gsap-bonus/SplitText';
import {
  ScrollTrigger
} from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default () => {

  const introContainer = document.querySelector('.page-intro__container');
  const breadcrumbsContainer = document.querySelector('.breadcrumbs__container');

  const timeLine = gsap.timeline({
    paused: true,
    reversed: true
  });

  gsap.set(breadcrumbsContainer, {
    yPercent: 4,
  });

  gsap.set(introContainer, {
    yPercent: 4,
  });

  timeLine
    .to(breadcrumbsContainer, {
      opacity: 1,
      yPercent: 0,
      duration: 1.4
    }, "start")
    .to(introContainer, {
      opacity: 1,
      yPercent: 0,
      duration: 1.4
    }, "start")

  timeLine.play();
}
