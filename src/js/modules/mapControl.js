import Swiper from 'swiper/swiper-bundle';

import moment from 'moment';
import 'moment-timezone';
import IMask from 'imask';

export default () => {
  const mapSection = document.querySelector('.map');

  if (!mapSection) return;

  const balloon = document.querySelector('.map__balloon');
  const mapWrapper = document.getElementById('yamap');
  const script = document.createElement('script');
  const mapInput = document.getElementById('suggest');
  const filterCheckboxes = mapSection.querySelectorAll('.js-map-input-search');
  const closeAndClearFilter = mapSection.querySelector('.js-close-clear-filter');
  const mobileCheckboxFilter = document.querySelector('.map__filter-popup');
  const locateButtons = document.querySelectorAll('.map-nav-buttons__locate');
  const mobileButtonForInitCkick = document.querySelector('.js-init-button-mob');
  const descButtonForInitCkick = document.querySelector('.js-init-button-desc');
  const clearButtons = document.querySelectorAll('.js-map-clear-all');

  let myCoords = [];
  let coordsPoints = [];
  let allPoints = [];

  function appHeight() {
    const doc = document.documentElement
    doc.style.setProperty('--vh', (window.innerHeight * .01) + 'px');
  }

  window.addEventListener('resize', appHeight);
  appHeight();

  // получаем json:
  let parsedJson = JSON.parse(JSON.stringify(cities));

  // сбор всех точек из объекта:
  parsedJson.forEach(item => {
    let dropDownLi = document.createElement('li');
    let dropDownA = document.createElement('a');
    dropDownLi.classList.add('menu-dropdown__item');
    dropDownA.classList.add('sidebar-map__dropdown-link');
    dropDownA.dataset.index = item.index;
    dropDownA.textContent = item.cityName;
    dropDownLi.appendChild(dropDownA);
    document.querySelector('.sidebar-map__dropdown-menu').appendChild(dropDownLi);

    let mobDropDownLi = document.createElement('li');
    mobDropDownLi.classList.add('filter-popup__item');

    let mobDropDownCheckboxWrapper = document.createElement('div');
    mobDropDownCheckboxWrapper.classList.add('filter-popup__checkbox');

    let mobDropDownCheckbox = document.createElement('div');
    mobDropDownCheckbox.classList.add('checkbox');

    let mobDropDownInput = document.createElement('input');
    mobDropDownInput.classList.add('visually-hidden');
    mobDropDownInput.classList.add('js-city-checkbox');
    mobDropDownInput.type = "radio";
    mobDropDownInput.name = "city-choice";
    mobDropDownInput.value = "custom";
    mobDropDownInput.id = `cid-${item.index}`;
    mobDropDownInput.dataset.index = item.index;

    let mobDropDownLabel = document.createElement('label');
    mobDropDownLabel.classList.add('checkbox__container');
    mobDropDownLabel.htmlFor = `cid-${item.index}`;

    let mobDropDownSpanOne = document.createElement('span');
    mobDropDownSpanOne.classList.add('checkbox__control');
    mobDropDownSpanOne.classList.add('checkbox__control--rounded');

    let mobDropDownSpan = document.createElement('span');
    mobDropDownSpan.classList.add('checkbox__text');
    mobDropDownSpan.textContent = item.cityName;

    mobDropDownLabel.appendChild(mobDropDownSpanOne);
    mobDropDownLabel.appendChild(mobDropDownSpan);

    mobDropDownCheckbox.appendChild(mobDropDownInput);
    mobDropDownCheckbox.appendChild(mobDropDownLabel);

    mobDropDownCheckboxWrapper.appendChild(mobDropDownCheckbox);

    mobDropDownLi.appendChild(mobDropDownCheckboxWrapper);
    document.querySelector('.map__dropdown-popup').querySelector('.filter-popup__list').appendChild(mobDropDownLi);

    item.points.forEach(point => {
      coordsPoints.push(point.coordinates);
      allPoints.push(point);
    })
  });

  // упрощение объекта с координатам:
  let simplestPoints = parsingPoints(allPoints);

  script.src = "https://api-maps.yandex.ru/2.1/?apikey=d02525f1-2a0d-4700-a5e1-e4487f06702c&?apikey=d02525f1-2a0d-4700-a5e1-e4487f06702c&load=package.full&lang=ru-RU";
  document.head.append(script);

  script.onload = function () {
    if (mapWrapper) {
      ymaps.ready(init);
    }
  }

  setTimeout(() => {
    if ((window.matchMedia("(min-width: 992px)").matches)) {
      descButtonForInitCkick.click();
    } else {
      mobileButtonForInitCkick.click();
    }
  }, 500);

  // ====================================================================================================
  // ======================= primary funcs: ===========================================================

  function init() {
    descButtonForInitCkick.click();

    let zoom = (window.matchMedia("(min-width: 992px)").matches) ? 13 : 12;
    let geolocation = ymaps.geolocation,

      myMap = new ymaps.Map('yamap', {
        center: [55.779640, 49.130656],
        zoom: zoom,
        controls: ['geolocationControl'],
        behaviors: ['drag', 'scrollZoom', 'multiTouch'],
      }, {
        searchControlProvider: 'yandex#search'
      }),

      // кнопки геолокации и зума ==========================================>
      ZoomLayout = ymaps.templateLayoutFactory.createClass("<div style='opacity: 0;' >" +
        "<div id='zoom-in' class='btn'>+</i></div><br>" +
        "<div id='zoom-out' class='btn'>-</i></div>" +
        "</div>", {
          // Переопределяем методы макета, чтобы выполнять дополнительные действия
          // при построении и очистке макета.
          build: function () {
            // Вызываем родительский метод build.
            ZoomLayout.superclass.build.call(this);

            // Привязываем функции-обработчики к контексту и сохраняем ссылки
            // на них, чтобы потом отписаться от событий.
            this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
            this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

            // Начинаем слушать клики на кнопках макета.
            $('#zoom-in').bind('click', this.zoomInCallback);
            $('#zoom-out').bind('click', this.zoomOutCallback);

            // иммитация нажатия
            $('.map-nav-buttons__zoom-in').click(function () {
              $('#zoom-in').trigger("click");
            });
            $('.map-nav-buttons__zoom-out').click(function () {
              $('#zoom-out').trigger("click");
            });
          },

          clear: function () {
            // Снимаем обработчики кликов.
            $('#zoom-in').unbind('click', this.zoomInCallback);
            $('#zoom-out').unbind('click', this.zoomOutCallback);

            // Вызываем родительский метод clear.
            ZoomLayout.superclass.clear.call(this);
          },

          zoomIn: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() + 1, {
              checkZoomRange: true
            });
          },

          zoomOut: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() - 1, {
              checkZoomRange: true
            });
          }
        }),

      zoomControl = new ymaps.control.ZoomControl({
        options: {
          layout: ZoomLayout
        }
      });
    myMap.controls.add(zoomControl);

    $('.map-nav-buttons__locate').click(function () {
      geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
      }).then(function (result) {
        result.geoObjects.options.set({
          hasBalloon: false,
          hasHint: false
        });
        myMap.geoObjects.add(result.geoObjects);
      });
    })
    // <========================================== кнопки геолокации и зума

    // свой поиск ========================================================>

    // Подключаем поисковые подсказки к полю ввода.
    const suggestContianerLayoutDesc = document.getElementById('suggest-c-des');
    const suggestContianerLayoutMob = document.getElementById('suggest-c-mob');
    let suggestContianer = (window.matchMedia("(min-width: 992px)").matches) ? suggestContianerLayoutDesc : suggestContianerLayoutMob;

    var suggestView = new ymaps.SuggestView('suggest', {
      container: suggestContianer,
      results: 20,
      offset: [0, 8]
    });

    // При клике по кнопке запускаем верификацию введёных данных.
    mapInput.addEventListener('change', (e) => {
      geocode();
    })

    function geocode() {
      // Забираем запрос из поля ввода.
      var request = $('#suggest').val();
      // Геокодируем введённые данные.
      ymaps.geocode(request).then(function (res) {
        var obj = res.geoObjects.get(0),
          error, hint;

        if (obj) {
          switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
            case 'exact':
              break;
            case 'number':
            case 'near':
            case 'range':
              error = 'Неточный адрес, требуется уточнение';
              hint = 'Уточните номер дома';
              break;
            case 'street':
              error = 'Неполный адрес, требуется уточнение';
              hint = 'Уточните номер дома';
              break;
            case 'other':
            default:
              error = 'Неточный адрес, требуется уточнение';
              hint = 'Уточните адрес';
          }
        } else {
          error = 'Адрес не найден';
          hint = 'Уточните адрес';
        }

        // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
        if (error) {
          showError(error);
        } else {
          showResult(obj);
        }
      }, function (e) {
        console.log(e)
      })
    }

    function showResult(obj) {
      // Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
      $('#suggest').removeClass('input_error');
      $('#notice').css('display', 'none');

      var mapContainer = $('#yamap'),
        bounds = obj.properties.get('boundedBy'),
        // Рассчитываем видимую область для текущего положения пользователя.
        mapState = ymaps.util.bounds.getCenterAndZoom(
          bounds,
          [mapContainer.width(), mapContainer.height()]
        ),
        // Сохраняем полный адрес для сообщения под картой.
        address = [obj.getCountry(), obj.getAddressLine()].join(', '),
        // Сохраняем укороченный адрес для подписи метки.
        shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
      // Убираем контролы с карты.
      mapState.controls = [];
      // Создаём карту.
      createMap(mapState, shortAddress);
    }

    function showError(message) {
      $('#notice').text(message);
      $('#suggest').addClass('input_error');
      $('#notice').css('display', 'block');
    }

    function createMap(state, caption) {
      myMap.setCenter(state.center, 14);

      let MyIconContentLayout = ymaps.templateLayoutFactory.createClass([
        '<svg width="32" height="37" viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="32" height="32" rx="16" fill="#2A2A2A"/>',
        '<path d="M17.8995 13.1449C19.2124 14.4578 19.2124 16.5865 17.8995 17.8995C16.5865 19.2124 14.4578 19.2124 13.1449 17.8995C11.8319 16.5865 11.8319 14.4578 13.1449 13.1449C14.4578 11.8319 16.5865 11.8319 17.8995 13.1449" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
        '<path d="M19.8451 19.849L18.0391 18.043" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
        '<path d="M19.0318 30H13.6098C13.2381 30 12.9964 30.3912 13.1626 30.7236L15.8736 36.1456C16.0578 36.5141 16.5837 36.5141 16.768 36.1456L19.479 30.7236C19.6452 30.3912 19.4035 30 19.0318 30Z" fill="#2A2A2A"/>',
        '</svg>'
      ].join(''));

      let placemark = new ymaps.Placemark(state.center, {}, {
        iconLayout: 'default#imageWithContent',
        iconContentLayout: MyIconContentLayout,
        iconImageSize: [32, 32],
        iconImageOffset: [-16, -16]
      });

      myMap.geoObjects.add(placemark);
    }
    // <======================================================== свой поиск
    initGeolocation(myMap, geolocation);

    let coordsArr = [];

    const activeOfficeType = [...filterCheckboxes]
      .filter(checkbox => {
        return checkbox.name === "office-type"
      })
      .find(checkbox => {
        console.log(checkbox.checked);
        return checkbox.checked
      })
      .value

    simplestPoints
      .filter(point => point.officeType === activeOfficeType)
      .forEach(point => {
        coordsArr.push(point.coords);
      })

    renderPoints(myMap, coordsArr);

    let allPointsCopy;

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        let values = [];
        let newCoords = [];
        allPointsCopy = [...simplestPoints];

        // собираем все выбранные параметры:
        filterCheckboxes.forEach(input => {
          if (input.checked && (input.dataset.checkrole !== 'workingInfo')) {
            values.push({
              checkrole: input.dataset.checkrole,
              value: input.value,
            });
          } else if (input.checked && (input.dataset.checkrole === 'workingInfo')) {
            if (input.value === 'dayAndNight') {
              values.push({
                checkrole: input.value,
                type: input.dataset.checkrole,
                value: true,
              });
            } else if (input.dataset.checkrole === 'workingInfo') {
              values.push({
                checkrole: input.value,
                type: input.dataset.checkrole,
                value: true,
              });
            }
          }
        })

        allPointsCopy.forEach(point => {
          values.forEach(value => {
            console.log(value.checkrole);
            if (Object.keys(point).find(key => key === value.checkrole)) {
              if (value.checkrole === 'officeType') {
                if (!(value.value === point[value.checkrole])) {
                  allPointsCopy = allPointsCopy.filter(el => el !== point);
                }
              }

              if (value.checkrole === 'currencyTypes') {
                if (!point[value.checkrole].includes(value.value)) {
                  allPointsCopy = allPointsCopy.filter(el => el !== point);
                }
              }

              if (value.checkrole === 'operationTypes') {
                if (!point[value.checkrole].includes(value.value)) {
                  allPointsCopy = allPointsCopy.filter(el => el !== point);
                }
              }

              if (value.checkrole === 'isWorkingNow') {

                if (!(value.checkrole === point[value.checkrole])) {
                  if (!(value.value === point[value.checkrole])) {
                    allPointsCopy = allPointsCopy.filter(el => el !== point);
                  }
                }
              }

              if (value.checkrole === 'dayAndNight') {
                if (!(value.value === point[value.checkrole])) {
                  allPointsCopy = allPointsCopy.filter(el => el !== point);
                }
              }
            }
          })
        })

        // console.log(allPointsCopy);

        allPointsCopy.forEach(point => {
          newCoords.push(point.coords);
        })

        if (newCoords.length) {
          myMap.geoObjects.removeAll();
          renderPoints(myMap, newCoords);
        }

      })
    })

    // переключение по городам
    document.querySelectorAll('[data-index]').forEach(a => {
      a.addEventListener('click', () => {
        let dataIndex = a.dataset.index;

        parsedJson.forEach(item => {
          if (item.index == dataIndex) {
            myMap.setCenter(item.cityCenterCoords, 11, {
              duration: 200
            });
          }
        })

        document.querySelector('.sidebar-map__dropdown-menu').classList.remove('is-active');
      })
    })

    // сброс фильтра
    closeAndClearFilter.addEventListener('click', () => {
      mobileCheckboxFilter.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
      })
    })

    clearButtons.forEach(clearButton => {
      clearButton.addEventListener('click', () => {
        document.querySelector('.sidebar-map__filters--desctop').querySelectorAll('.js-map-input-search').forEach(item => {
          item.checked = false;
        })

        document.querySelector('.sidebar-map__filters--mobile').querySelectorAll('.js-map-input-search').forEach(item => {
          item.checked = false;
        })

        document.querySelector('.filter-popup__list').querySelectorAll('.js-map-input-search').forEach(item => {
          item.checked = false;
        })

        document.querySelector('.js-pseudo-clear').click();
      })
    })
  }

  function initGeolocation(map, geolocation) {
    geolocation.get({
      provider: 'browser',
      mapStateAutoApply: true
    }).then(function (result) {
      result.geoObjects.options.set({
        hasBalloon: false,
        hasHint: false
      });

      myCoords = result.geoObjects.get(0).geometry.getCoordinates();
      map.geoObjects.add(result.geoObjects);
      map.setBounds(result.geoObjects.getBounds(), {
        checkZoomRange: true
      }).then(function () {
        if (map.getZoom() > 10) map.setZoom(14);
      });

      locateButtons.forEach(locateButton => {
        locateButton.classList.remove('map-nav-buttons__locate--disabled');
      })
    }, function (e) {
      myCoords = [55.779640, 49.130656];
    });
  }

  // ====================================================================================================
  // ======================= secondary funcs: ===========================================================

  // рендер точек на карте
  function renderPoints(map, pointsArray) {
    const locateMessage = document.querySelector('.map__location-message');
    let points = pointsArray,
      iconsize = (window.matchMedia("(min-width: 992px)").matches) ? [50, 50] : [40, 40],
      clussterSize = (window.matchMedia("(min-width: 992px)").matches) ? [100, 100] : [70, 70],
      gridSize = (window.matchMedia("(min-width: 992px)").matches) ? 400 : 100,
      geoObjects = [],


      // кастомная иконка кластера ==========================================>
      clusterIcons = [{
          size: clussterSize,
          // Отступ, чтобы центр картинки совпадал с центром кластера.
          offset: [-50, -50]
        },
        {
          size: [50, 50],
          offset: [-25, -25],
          // Можно задать геометрию активной области метки.
          // Если геометрия не задана, активной областью будет
          // прямоугольник.
          shape: {
            type: 'Circle',
            coordinates: [0, 0],
            radius: 100
          }
        }
      ],

      clusterNumbers = [10],

      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="clusterIcon">{{ properties.geoObjects.length }}</div>'
      ),

      clusterer = new ymaps.Clusterer({
        clusterIconContentLayout: MyIconContentLayout,
        clusterIcons: clusterIcons,
        clusterNumbers: clusterNumbers,
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: true,
        geoObjectHideIconOnBalloonOpen: false
      }),
      // <========================================== кастомная иконка кластера

      // кастомная иконка плеймарка =========================================>
      getPointData = function (index) {
        return {
          hasBalloon: false,
        };
      },

      MyIconLayout = ymaps.templateLayoutFactory.createClass([
        '<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">',
        '<rect width="50" height="50" rx="25" fill="#F8661C"/>',
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M27.8972 16.9163C27.7703 17.4307 26.7552 20.5175 24.8519 22.3181C22.8217 20.6461 21.6797 16.9163 21.6797 16.9163C20.4109 18.9741 19.3958 21.5464 19.3958 21.5464C19.3958 21.5464 21.426 27.5913 24.8519 30.2922C28.2779 27.334 30.1812 21.4178 30.1812 21.4178C30.1812 21.4178 29.4199 19.2313 27.8972 16.9163ZM27.8972 15.6301C27.8972 15.6301 26.8821 18.9741 24.8519 20.7747C22.9486 19.2313 21.8066 15.6301 21.8066 15.6301C21.8066 15.6301 22.9486 12.672 24.8519 11C26.8821 12.5434 27.8972 15.6301 27.8972 15.6301ZM29.9274 23.4756C31.0694 25.6621 31.7038 27.334 31.7038 27.334C31.7038 27.334 29.1661 36.0798 24.8519 39.9383C20.4109 36.3371 18 27.4627 18 27.4627V27.2054C18.1269 26.8196 18.6344 25.4048 19.6495 23.6042C20.284 25.2762 22.1873 29.7777 24.8519 32.0928C27.8972 29.3919 29.4199 24.8904 29.9274 23.4756Z" fill="white"/>',
        '</svg>'
      ].join('')),

      getPointOptions = function () {
        return {
          iconLayout: 'default#imageWithContent',
          iconContentLayout: MyIconLayout,
          iconImageSize: iconsize,
          iconImageOffset: [-25, -25]
        };
      };

    for (var i = 0, len = points.length; i < len; i++) {
      geoObjects[i] = new ymaps.Placemark(points[i], {
          hasBalloon: false,
        },
        getPointOptions());
    }

    clusterer.options.set({
      gridSize: gridSize,
      clusterDisableClickZoom: false
    });

    clusterer.add(geoObjects);
    map.geoObjects.add(clusterer);

    map.geoObjects.events.add('click', function (e) {
      let target = e.get('target');
      map.setCenter(target.geometry.getCoordinates(), 15, {
        duration: 400
      });
      let point = getPointInfoByCoordinates(target.geometry.getCoordinates());
      renderBalloonWithInfo(point, myCoords);
    });

    map.events.add(['boundschange', 'datachange', 'objecttypeschange'], function () {
      let objects = ymaps.geoQuery(geoObjects).searchInside(map);
      if (objects.getLength() > 0) {
        locateMessage.classList.remove('is-visible');
      } else {
        locateMessage.classList.add('is-visible');
      }
    });

  }

  function parsingPoints(points) {
    return points.map(point => {
      return {
        coords: point.coordinates,
        officeType: point.officeType,
        operationTypes: (point.operationTypes[0].operationStatus ? [...Array.from(point.operationTypes[0].operationNames)] : []).concat(point.operationTypes[1].operationStatus ? [...Array.from(point.operationTypes[1].operationNames)] : []).map(item => item.name),
        currencyTypes: point.currencyTypes.map(item => item.name),
        dayAndNight: point.workingInfo.roundTheClock,
        isWorkingNow: isOpen((point.workingInfo.openHours), (point.workingInfo.closeHourse)),
        card: point.card
      };
    })
  }

  // ищем поинт по коодинатам:
  function getPointInfoByCoordinates(coords) {
    let parsedPoint;
    parsedJson.forEach(city => {
      city.points.forEach(point => {
        if (point.coordinates === coords) {
          parsedPoint = Object.assign({}, point);
        }
      })
    })
    return parsedPoint;
  }

  //  рендерим и открываем балун с информацией:
  function renderBalloonWithInfo(point, anchor) {
    const nameSpans = document.querySelectorAll('.js-b-name');
    const addressMainSpans = document.querySelectorAll('.js-b-address-m');
    const addressSecondarySpans = document.querySelectorAll('.js-b-address-s');
    const openingSpans = document.querySelectorAll('.js-b-opening-m');
    const routingButtons = document.querySelectorAll('.js-b-routing');
    const cardBlock = document.querySelector('.map-balloon__card-link');

    let clearSpans = document.querySelectorAll('.js-b-clear');
    clearSpans.forEach(clearSpan => {
      clearSpan.textContent = '';
    })

    let removingSpans = document.querySelectorAll('.js-b-remove');

    removingSpans.forEach(removingSpan => {
      removingSpan.remove();
    })

    nameSpans.forEach(nameSpan => {
      nameSpan.textContent = point.pointName;
    })

    addressMainSpans.forEach(addressMainSpan => {
      addressMainSpan.textContent = point.pointAddress.addressMain;
    })

    addressSecondarySpans.forEach(addressSecondarySpan => {
      addressSecondarySpan.textContent = point.pointAddress.addressBuilding;
    })

    openingSpans.forEach(openingSpan => {
      openingSpan.textContent = point.pointAddress.openingHours;
    })

    routingButtons.forEach(routingButton => {
      let coordsFrom = (`${anchor[0]},${anchor[1]}`).toString();
      let coordsTo = (`${point.coordinates[0]},${point.coordinates[1]}`).toString();

      routingButton.href = `https://yandex.ru/maps/?rtext=${coordsFrom}~${coordsTo}`;
    })

    point.conditions.forEach(condition => {
      let span = document.createElement('span');
      span.classList.add('type-radio__info-text');
      span.classList.add('type-radio__info-text--conditions');
      span.classList.add('js-b-remove');
      span.classList.add('js-b-conditions-m');
      span.textContent = condition.conditionsText;
      document.querySelector('.type-radio__item--conditions').append(span);
    });

    if (point.operationTypes[0].operationStatus === true && (point.operationTypes[0].operationNames.length)) {
      point.operationTypes[0].operationNames.forEach(operationName => {
        document.querySelector('.type-radio__item--individuals').firstElementChild.textContent = "Для частных лиц";
        let span = document.createElement('span');
        span.classList.add('type-radio__info-text');
        span.classList.add('type-radio__info-text--with-marker');
        span.classList.add('type-radio__info-text--for-individuals');
        span.classList.add('js-b-remove');
        span.classList.add('js-b-individuals-m');
        if (operationName.nameRu) {
          span.textContent = operationName.nameRu;
        } else {
          span.textContent = operationName.name;
        }
        document.querySelector('.type-radio__item--individuals').append(span);
      });
    } else {
      document.querySelector('.type-radio__item--individuals').firstElementChild.textContent = "";
    }


    if (point.operationTypes[1].operationStatus === true && (point.operationTypes[1].operationNames.length)) {
      point.operationTypes[1].operationNames.forEach(operationName => {
        document.querySelector('.type-radio__item--legals').firstElementChild.textContent = "Для юридических лиц";
        let span = document.createElement('span');
        span.classList.add('type-radio__info-text');
        span.classList.add('type-radio__info-text--with-marker');
        span.classList.add('type-radio__info-text--for-individuals');
        span.classList.add('js-b-remove');
        span.classList.add('js-b-individuals-m');
        if (operationName.nameRu) {
          span.textContent = operationName.nameRu;
        } else {
          span.textContent = operationName.name;
        }
        document.querySelector('.type-radio__item--legals').append(span);
      });
    } else {
      document.querySelector('.type-radio__item--legals').firstElementChild.textContent = "";
    }

    if (point.card) {
      cardBlock.style.display = "block";
      cardBlock.setAttribute("href", point.card[0].cardLink);

      cardBlock.querySelector("img").setAttribute("src", point.card[0].cardImage);
      cardBlock.querySelector(".map-card-link__name").textContent = point.card[0].cardTitle;
      cardBlock.querySelector(".map-card-link__text").textContent = point.card[0].cardDesc;
    } else {
      cardBlock.style.display = "none";
    }

    balloon.classList.add('map__balloon--is-open');
    mapSection.classList.add('_dropdown-is-open');
  }

  // открыт ли сейчас магазин:
  function isOpen(openTime, closeTime, timezone = "Europe/Moscow") {
    // handle special case
    if (openTime === "24HR") {
      return "open";
    }
    // get the current date and time in the given time zone
    const now = moment.tz(timezone);
    // Get the exact open and close times on that date in the given time zone
    // See https://github.com/moment/moment-timezone/issues/119
    const date = now.format("YYYY-MM-DD");
    const storeOpenTime = moment.tz(date + ' ' + openTime, "YYYY-MM-DD h:mmA", timezone);
    const storeCloseTime = moment.tz(date + ' ' + closeTime, "YYYY-MM-DD h:mmA", timezone);
    let check;
    if (storeCloseTime.isBefore(storeOpenTime)) {
      // Handle ranges that span over midnight
      check = now.isAfter(storeOpenTime) || now.isBefore(storeCloseTime);
    } else {
      // Normal range check using an inclusive start time and exclusive end time
      check = now.isBetween(storeOpenTime, storeCloseTime, null, '[)');
    }
    return check ? true : false;
  }
  // console.log(isOpen("8:00PM", "8:00AM"));

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  Array.prototype.unique = function () {
    var a = [];
    var l = this.length;

    for (var i = 0; i < l; i++) {
      for (var j = i + 1; j < l; j++) {
        if (this[i] === this[j]) {
          j = ++i;
        }
      }
      a.push(this[i]);
    }

    return a;
  };
  //// ====================================================================================================
}

export function mapPatterns() {
  const mapSection = document.querySelector('.map')
  const mapInput = document.getElementById('suggest');
  const searchMap = document.querySelector('.search-map');
  const mapSidebar = document.querySelector('.map__sidebar');
  const mobileCheckboxes = document.querySelectorAll('.map-filters-mobile__input');
  const mobileFilterCheckboxes = document.querySelectorAll('.js-map-checkbox');
  const nameInputs = document.querySelectorAll('.js-input-mask_text');
  const clearInputs = document.querySelectorAll('.js-input-clear');

  if (!mapSection) return;
  // secondary patterns: ======================================================>
  mapSection.addEventListener('click', (e) => {
    if (e.target.closest('.map-balloon__close-btn')) {
      e.target.closest('.map__balloon').classList.remove('map__balloon--is-open');
      mapSection.classList.remove('_dropdown-is-open');
    }

    if (!window.matchMedia("(min-width: 992px)").matches) {
      if (searchMap.querySelector('.search-map__input') === document.activeElement) {
        mapSidebar.classList.add('_search-is-focus');
      }
    } else {
      if (searchMap.querySelector('.search-map__input') === document.activeElement) {
        mapSidebar.classList.add('_search-is-focus');
      } else {
        mapSidebar.classList.remove('_search-is-focus');
      }
    }

  })

  mapInput.addEventListener('input', () => {

    if (mapInput.value) {
      mapInput.closest('.search-map').classList.add('search-map--filled');
    } else if (!mapInput.value) {
      mapInput.closest('.search-map').classList.remove('search-map--filled');
    }
  })

  searchMap.addEventListener('click', (e) => {
    if (e.target.closest('.search-map__button--close')) {
      searchMap.classList.remove('search-map--filled');
      searchMap.querySelector('.search-map__input').value = '';
      searchMap.querySelector('.search-map__notice').textContent = '';
    }
  })

  mobileCheckboxes.forEach(mobileCheckbox => {
    mobileCheckbox.addEventListener('input', () => {

      setTimeout(() => {
        if (mobileCheckbox.checked) {
          mobileFilterCheckboxes.forEach(checkbox => {
            if (checkbox.value === mobileCheckbox.dataset.param) {
              checkbox.checked = true;
            }
          })
        } else if (!mobileCheckbox.checked) {
          mobileFilterCheckboxes.forEach(checkbox => {
            if (checkbox.value === mobileCheckbox.dataset.param) {
              checkbox.checked = false;
            }
          })
        }
      }, 200);
    })
  })

  mobileFilterCheckboxes.forEach(filterCheckbox => {
    filterCheckbox.addEventListener('input', () => {
      setTimeout(() => {
        if (filterCheckbox.checked) {
          mobileCheckboxes.forEach(checkbox => {
            if (checkbox.dataset.param === filterCheckbox.value) {
              checkbox.checked = true;
            }
          })
        } else if (!filterCheckbox.checked) {
          mobileCheckboxes.forEach(checkbox => {
            if (checkbox.dataset.param === filterCheckbox.value) {
              checkbox.checked = false;
            }
          })
        }
      }, 200);


      let boolCounter = [];

      if (filterCheckbox.checked) {
        document.querySelector('.filter-popup__buttons').classList.add('filter-popup__buttons--visible');
      }

      mobileFilterCheckboxes.forEach(filterCheckbox => {
        if (filterCheckbox.checked) {
          boolCounter.push(true);
        } else {
          boolCounter.push(false);
        }
      })

      if (!boolCounter.find(item => item === true)) {
        document.querySelector('.filter-popup__buttons').classList.remove('filter-popup__buttons--visible');
      }
    })
  })

  clearInputs.forEach(item => {
    item.addEventListener('click', () => {
      document.querySelector('.filter-popup__buttons').classList.remove('filter-popup__buttons--visible');
      mobileCheckboxes.forEach(input => {
        input.checked = false;
      })
    })
  })

  const swiperMobileTags = new Swiper('.js-mobile-tags-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 6,
    watchSlidesProgress: true,
    updateOnWindowResize: true,

    on: {
      click: function () {
        swiperMobileTags.updateSize();
        swiperMobileTags.updateSlides();
      },
    },
  });

  nameInputs.forEach(nameInput => {
    const nameMask = IMask(nameInput, {
      mask: /^[А-Яа-яЁё0-9 ]+$/,
    });
  })
}

export function mapFiltersControl() {
  const mapSection = document.querySelector('.map');

  if (!mapSection) return;

  const mapSidebarForMobile = document.querySelector('.map__sidebar');
  const mobileFilters = document.querySelectorAll('.filter-popup');
  const mobileDropdown = document.querySelector('.map__dropdown-popup');
  const mobileBalloon = document.querySelector('.map__balloon');
  const mobileHeader = document.querySelector('.map__mobile-header');
  const mobileCheckboxFilter = document.querySelector('.map__filter-popup');
  const mobileCityButton = document.querySelector('.js-mobile-dropdown');
  const mobileFilterButton = document.querySelector('.map-filters-mobile__open-filters-btn');
  const filterButton = mapSection.querySelector('.js-filter-al-btn');
  const sidebarFiltersDec = document.querySelector('.sidebar-map__filters--desctop');
  const sidebarFiltersMobile = document.querySelector('.sidebar-map__filters--mobile');
  const mobileFilterCheckboxes = document.querySelectorAll('.js-map-checkbox');
  const mobileCheckboxes = document.querySelectorAll('.map-filters-mobile__input');

  window.addEventListener('click', (e) => {
    if (!window.matchMedia("(min-width: 992px)").matches) {
      if (mobileBalloon.classList.contains('map__balloon--is-open') &&
        !e.target.closest('.map-balloon__body')) {
        mobileBalloon.classList.remove('map__balloon--is-open');
        mapSection.classList.remove('_dropdown-is-open');
      }
    }
  })

  if (mobileFilters.length) {
    mobileFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        if (e.target.closest('.filter-popup__close-btn') || !e.target.closest('.filter-popup__body')) {
          e.target.closest('.filter-popup').classList.remove('_is-open');
          mapSection.classList.remove('_dropdown-is-open');
        }
      })
    })
  }

  if (mobileCityButton) {
    mobileCityButton.addEventListener('click', () => {
      if (window.matchMedia("(min-width: 992px)").matches) {
        return;
      } else {
        mobileDropdown.classList.add('_is-open');
        mapSection.classList.add('_dropdown-is-open');
      }
    })
  }

  if (mobileFilterButton) {
    mobileFilterButton.addEventListener('click', () => {
      if (window.matchMedia("(min-width: 992px)").matches) {
        return;
      } else {
        mobileCheckboxFilter.classList.add('_is-open');

        mobileFilterCheckboxes.forEach(filterCheckbox => {
          setTimeout(() => {
            if (filterCheckbox.checked) {
              mobileCheckboxes.forEach(checkbox => {
                if (checkbox.dataset.param === filterCheckbox.value) {
                  checkbox.checked = true;
                }
              })
            } else if (!filterCheckbox.checked) {
              mobileCheckboxes.forEach(checkbox => {
                if (checkbox.dataset.param === filterCheckbox.value) {
                  checkbox.checked = false;
                }
              })
            }
          }, 200);


          let boolCounter = [];

          if (filterCheckbox.checked) {
            document.querySelector('.filter-popup__buttons').classList.add('filter-popup__buttons--visible');
          }

          mobileFilterCheckboxes.forEach(filterCheckbox => {
            if (filterCheckbox.checked) {
              boolCounter.push(true);
            } else {
              boolCounter.push(false);
            }
          })

          if (!boolCounter.find(item => item === true)) {
            document.querySelector('.filter-popup__buttons').classList.remove('filter-popup__buttons--visible');
          }
        })

      }
    })
  }

  if (mapSidebarForMobile) {
    let mapSidebarOpen = false;
    mapSidebarForMobile.addEventListener('click', (e) => {
      if (window.matchMedia("(min-width: 992px)").matches) {
        return;
      } else if (!window.matchMedia("(min-width: 992px)").matches && !mapSidebarOpen) {
        if (e.target.closest('.sidebar-map__nav-buttons')) {
          return;
        } else if (e.target.closest('.map__sidebar') && !e.target.closest('.sidebar-map__nav-buttons') && !e.target.closest('.map-filters-mobile__body') && !e.target.closest('.sidebar-map__search-close-btn')) {
          mapSidebarForMobile.classList.add('_is-open');
          mapSidebarOpen = true;
        }
      } else if (!window.matchMedia("(min-width: 992px)").matches && mapSidebarOpen) {
        if (!e.target.closest('.sidebar-map__body')) {
          mapSidebarForMobile.classList.remove('_is-open');
          mapSidebarForMobile.classList.remove('_search-is-focus');
          mapSidebarOpen = false;
        }
      }
    })

    document.querySelector('.sidebar-map__search-close-btn').addEventListener('click', () => {
      mapSidebarForMobile.classList.remove('_is-open');
      mapSidebarOpen = false;
      mapSidebarForMobile.classList.remove('_search-is-focus');
      document.querySelector('.search-map__input').value = '';
      document.querySelector('.search-map__notice').textContent = '';
    })

    document.querySelector('.filter-popup__close-btn--cities').addEventListener('click', () => {
      mapSidebarForMobile.classList.remove('_is-open');
      mapSidebarForMobile.classList.remove('_search-is-focus');
      mapSidebarOpen = false;
    })
  }

  if (!(window.matchMedia("(min-width: 992px)").matches)) {
    sidebarFiltersDec.querySelectorAll('.js-map-input-search').forEach(item => {
      item.checked = false;
      item.disabled = true;
    })
  } else {
    mobileHeader.querySelectorAll('.js-map-input-search').forEach(item => {
      item.checked = false;
      item.disabled = true;
    })

    mobileCheckboxFilter.querySelectorAll('.js-map-input-search').forEach(item => {
      item.checked = false;
      item.disabled = true;
    })

    sidebarFiltersMobile.querySelectorAll('.js-map-input-search').forEach(item => {
      item.checked = false;
      item.disabled = true;
    })
  }

  window.addEventListener('resize', () => {

    if (!(window.matchMedia("(min-width: 992px)").matches)) {
      mobileHeader.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = true;
        item.disabled = false;
      })

      sidebarFiltersDec.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = false;
      })

      mapSidebarForMobile.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = false;
      })

      sidebarFiltersMobile.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = false;
      })

    } else {

      mobileHeader.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = true;
      })

      sidebarFiltersMobile.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = true;
      })

      sidebarFiltersDec.querySelectorAll('.js-map-input-search').forEach(item => {
        item.checked = false;
        item.disabled = false;
      })
    }
  })

  filterButton.addEventListener('click', () => {
    mobileFilters.forEach(element => {
      element.classList.remove('_is-open');
    });

    mapSidebarForMobile.classList.remove('_is-open');
  })
}
