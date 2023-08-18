// eslint-disable-next-line import/no-extraneous-dependencies
import 'focus-visible';
import lazyIMages from './modules/lazyIMages';
import onAddContainerForList, {
  twoFunction,
} from './modules/onAddContainerForList';
import documenReady from './helpers/documenReady';
import initModal from './modules/initModal';
import jsNumber from './modules/js-number';
import accordions from './modules/accordion';
import introSlider from './modules/introSlider';
import pageSwiper from './modules/page-swiper';
import tabs from './modules/tabs';
import fixedHeader from './modules/fixedHeader';
import fixedMenu from './modules/fixedMenu';
import validation from './modules/validation';
import phoneMask from './modules/inputMask';
import setStpesProgress from './modules/setStpesProgress';
import anchorLinks from './modules/anchorLinks';
import globalDropdownMenu from './modules/globalDropdownMenu';
import localMenuDropdown from './modules/localMenuDropdown';
import coinInfo from './modules/coinInfo';
import initSelects from './modules/initSelects';
import rangeSlider from './modules/rangeSlider';
import filterCoins from './modules/filterCoins';
import converter from './modules/converter';
import searchResultsFilter from './modules/searchResultsFilter';
import search from './modules/search';
import blocksReveal, {
  elementsBlocksReveal,
} from './modules/animatedBlocks';
import customSelectControl from './modules/customSelectControl';
import mapControl, {
  mapPatterns,
  mapFiltersControl,
} from './modules/mapControl';
import utilitySlider from './modules/utilitySlider';
import popularSlider from './modules/popularSlider';
import animatedLoadingPage from './modules/animatedLoadingPage';
import animatedFirstBlocks from './modules/animatedFirstBlocks';
import hoverElemMenu from './modules/hoverElemMenu';
import smoothScrollBlock from './modules/smoothScrollBlock';
import hideSliderButton from './modules/hide-slider-button';
import moreBankSlider from './modules/moreBankSlider';
import tabsLanding from './modules/tabsLanding';
import tabWidthAdjustment from './modules/tabWidthAdjustment';
import menuTabs from './modules/menuTabs';
import showHiddenBlocks from './modules/showHiddenBlocks';
import copyLinkToPage from './modules/copyLinkToPage';
import onShareLink from './modules/onShareLink';
import stickyFixedMenu from './modules/stickyFixedMenu';
import searchFields from './modules/searchFields';
import simpleSlider from './modules/simple-slider';
import popProductHide from './modules/popProductHide';
import autoscrollHiddenElements from './modules/autoscrollHiddenElements';
// import calcs from './modules/calcs';
import changingButtonWidth from './modules/changingButtonWidth';

documenReady(() => {
  window.tatsocbank_api = {
    ranges: [],
  };

  lazyIMages();
  initModal();
  onAddContainerForList();
  twoFunction();
  jsNumber();
  introSlider();
  pageSwiper();
  tabs();
  fixedHeader();
  fixedMenu();
  validation();
  phoneMask();
  setStpesProgress();
  anchorLinks();
  globalDropdownMenu();
  localMenuDropdown();
  coinInfo();
  initSelects();
  rangeSlider();
  filterCoins();
  converter();
  searchResultsFilter();
  search();
  blocksReveal();
  accordions();
  utilitySlider();
  popularSlider();
  animatedLoadingPage();
  customSelectControl();
  animatedFirstBlocks();
  hoverElemMenu();
  mapControl();
  mapPatterns();
  mapFiltersControl();
  elementsBlocksReveal();
  smoothScrollBlock();
  hideSliderButton();
  moreBankSlider();
  tabsLanding();
  tabWidthAdjustment();
  menuTabs();
  showHiddenBlocks();
  copyLinkToPage();
  onShareLink();
  stickyFixedMenu();
  searchFields();
  simpleSlider();
  popProductHide();
  autoscrollHiddenElements();
  // calcs();
  changingButtonWidth();

  window.tatsocbank_api.reinitCions = () => {
    tabs();
    coinInfo();
  };
});
