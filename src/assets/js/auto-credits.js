/* eslint-disable */

let autoCalc = {
  _state: {
      rateSum: 1000000
  },

  _initialInputOption: function (from, instance2, $input2) {
      let creditType = $('.js-auto-action').val();
      let initialPercent = (creditType == 6 ? .1 : .15);

      min2 = parseFloat(from * initialPercent).toFixed();
      max2 = parseFloat(from * .7).toFixed();
      from2 = max2 / 2;

      instance2.update({
          min: min2,
          max: max2,
          from: from2
      });

      $input2.prop('value', numberFormat(from2));
  },

  pmt: function(ratePerPeriod, numberOfPayments, presentValue, futureValue, type) {
      futureValue = typeof futureValue !== 'undefined' ? futureValue : 0;
      type = typeof type !== 'undefined' ? type : 0;
      if (ratePerPeriod != 0.0) {
          var q = Math.pow(1 + ratePerPeriod, numberOfPayments);
          return -(ratePerPeriod * (futureValue + (q * presentValue))) / ((-1 + q) * (1 + ratePerPeriod * (type)));
      } else if (numberOfPayments != 0.0) {
          return -(futureValue + presentValue) / numberOfPayments;
      }
      return 0;
  }
};

$(document).ready(function () {
  let $form = $('.js-form-calculator-auto');

  var $range3 = $('.js-range-slider-auto-3'),
      $input3 = $('.js-range-input-auto-3'),
      min3 = $range3.data('min'),
      max3 = $range3.data('max'),
      from3 = $range3.data('value');

  var instance3 = $range3.data('ionRangeSlider');



  var $range1 = $('.js-range-slider-auto-1'),
      $input1 = $('.js-range-input-auto-1'),
      min1 = $range1.data('min'),
      max1 = $range1.data('max'),
      from1 = $range1.data('value'),
      instance1,

      $range2 = $('.js-range-slider-auto-2'),
      $input2 = $('.js-range-input-auto-2'),
      min2 = $range2.data('min'),
      max2 = $range2.data('max'),
      from2 = $range2.data('value'),
      instance2;

  $range1.ionRangeSlider({
      min: min1,
      max: max1,
      from: from1,
      onStart: function(data) {
          min2 = min1 / 2;
          max2 = max1 / 2;
          from2 = max2 / 2;

          $input1.prop('value', numberFormat(data.from));
      },
      onChange: function(data) {
          $input1.prop('value', numberFormat(data.from));

          autoCalc._initialInputOption(data.from, instance2, $input2);
          auto($form);
      }
  });

  instance1 = $range1.data('ionRangeSlider');

  $input1.on('change keyup', function() {
      var
          val = $(this).prop('value').replace(/\s+/g, ''),
          valFormat = numberFormat(val);

      $(this).val(valFormat);

      if (val < min1) {
          val = min1;
      } else if (val > max1) {
          val = max1;
      }

      instance1.update({
          from: val
      });

      autoCalc._initialInputOption(val, instance2, $input2);
  });

  $range2.ionRangeSlider({
      min: min2,
      max: max2,
      from: from2,
      onStart: function(data) {
          $input2.prop('value', numberFormat(data.from));
      },
      onChange: function(data) {
          $input2.prop('value', numberFormat(data.from));
          auto($form);
      }
  });

  instance2 = $range2.data('ionRangeSlider');

  $input2.on('change keyup', function() {
      var
          val = $(this).prop('value').replace(/\s+/g, ''),
          valFormat = numberFormat(val);

      $(this).val(valFormat);

      if (val < min2) {
          val = min2;
      } else if (val > max2) {
          val = max2;
      }

      instance2.update({
          from: val
      });
  });

  $range3.ionRangeSlider({
      min: min3,
      max: max3,
      from: from3,
      onStart: function (data) {
          $input3.prop('value', numberWithSpaces(data.from));
      },
      onChange: function (data) {
          $input3.prop('value', numberWithSpaces(data.from));
          auto($form);
      }
  });

  $input3.on('change keyup', function () {
      var val = $(this).prop('value');

      if (val < min3) {
          val = min3;
      } else if (val > max3) {
          val = max3;
      }

      instance3.update({
          from: val
      });
  });

  $(document).on('click change keyup keydown', '.js-auto-action', function () {
      let $form = $(this).parents('form');
      // если поддержка сменить процент первоначалки
      if(($(this).val() == 7) || ($(this).val() == 6))
      {
          $input1.change();
      }
      auto($form);
  });

  $(document).on('click', '.js-calculator-order', function (e) {
      let $form = $('#calculator-order form');
      let program = $(this).parents('.js-calculator-programs-item').find('.h3 a').text();
      $form.find('[name="program"]').val(program);
  });

  $(document).on('click', '.js-graphics', function (e) {
      let $form = $('.js-form-calculator-auto');
      let $element = $(this).parents('[data-id]');
      //let id = $element.data('id');
      let defer = 0;
      if ($element.find('[data-result="deferred"]')) {
          defer = toNumber($element.find('[data-result="deferred"]').text());
      }


      let value = {
          amount: toNumber($form.find('[name="property-value"]').val()),
          initial: toNumber($form.find('[name="initial-fee"]').val()),
          term: toNumber($form.find('[name="credit-term"]').val()),
          monthly: toNumber($element.find('[data-result="monthly"]').text()),
          rate: toNumber($element.find('[data-result="rate"]').text()) / 10000,
          defer: defer,
      };

      let html = graphics(value);
      $('#calculator-result .jsDifferentiatedResult').html(html);

      let htmlAnnuity = graphicsAnnuity(value);
      $('#calculator-result .jsAnnuityResult').html(htmlAnnuity);
  });

  if ($('.js-calculator-programs-item') !== undefined && $('.js-calculator-programs-item').length) {
      let calculatorProgrammsItem = $('.js-calculator-programs-item');

      calculatorProgrammsItem.mouseover(function () {
          $(this).find('.js-calculator-programms-actions').stop().slideDown();
      }).mouseout(function () {
          $(this).find('.js-calculator-programms-actions').stop().slideUp();
      });
  }

  if ($('.js-number') !== undefined && $('.js-number').length) {
      $('.js-number').on('keypress', function(key) {
          if ((key.charCode < 48) || key.charCode > 57) return false;
      });
  }

  $(document).on('change', '[name="i-want"]', function () {
      var type = $('[name="i-want"] option:selected').val();

      var instance3 = $('.js-range-slider-auto-3').data('ionRangeSlider'),
          minTerm = 24;

      instance3.update({
          min: minTerm,
          max: 60,
          from: minTerm
      });
      $input3.prop('value', minTerm);
  });

  auto($form);
});

function auto($form) {
  let type = $form.find('[name="i-want"] option:selected').val(); // Хочу приобрести (6 - новые, 7 - поддержанные)
  let amount = toNumber($form.find('[name="property-value"]').val()); // Стоимость автомобиля
  let initial = toNumber($form.find('[name="initial-fee"]').val()); // Первоначальный взнос
  let term = toNumber($form.find('[name="credit-term"]').val()); // Срок кредита
  let creditAmount = $form.find('[name="credit-amount"]');
  let proof = $form.find('[name="proof-of-income"] option:selected').val(); // Подтверждение дохода
  let family1 = $form.find('[name="auto-family1"]:checked').val(); // Мне есть 28 лет, состою в браке, имею ребенка
  let family2 = $form.find('[name="auto-family2"]:checked').val(); // Мне есть 28 лет, состою в браке, имею ребенка
  let salary = $form.find('[name="salary"]:checked').val(); // Я получаю зарплату на карту Татсоцбанк
  let lifeInsurance = $form.find('[name="life-insurance"]:checked').val(); // Со страхованием жизни
  let notFound = $('.js-calculator-programs-item-not-found');
  let found = $('.js-calculator-programs-item-found');

  console.log(creditAmount);

  $form.find('[data-i-want]').hide();
  $form.find('[data-i-want="' + type + '"]').show();

  let resultsAuto = [];

  $.each(allAuto, function (key, value) {
      let add = true;
      let oneResult = {
          id: value.id,
          add: 0
      };

      if ($.inArray(type, value.type) === -1)
          add = false;

      if (value.min > amount || value.max < amount)
          add = false;

      if (initial > amount)
          add = false;

      let percentFee = (initial / amount * 100).toFixed(2);
      // console.log(initial + ' -- ' + amount + ' -- ' + value.feeMax + ' -- ' + value.feeMax);
      if (value.feeMin > percentFee || value.feeMax < percentFee)
          add = false;
      else
      {
          $('.js-auto-fee').text(percentFee + '%');
      }

      if ($.inArray(term, value.terms) === -1)
          add = false;

      let filterProof = true;
      $.each(value.options, function (idOption, option) {
          if (proof === idOption) {
              if (option !== false) {
                  oneResult.add += clearPercent(option);
                  filterProof = false;
              }
          }
      });
      if (filterProof)
          add = false;


      if (family1 === undefined && value.family1 !== '') {
          add = false;
      }
      if (family2 === undefined && value.family2 !== '') {
          add = false;
      }


      if (salary !== undefined && salary === 'Y')
          oneResult.add += clearPercent(value.salary);

      if (lifeInsurance !== undefined && lifeInsurance === 'Y')
          oneResult.add += clearPercent(value.lifeInsurance);

      if (add) {
          //рассчитаем результат
          let remainder = amount - initial;
          let defer = 0;
          let constant = Math.ceil(remainder / term);

          if (value.delay) {
              defer = ((amount - initial) * value.delay[term] / 100).toFixed();
              constant = ((remainder - defer) / (term - 1)).toFixed(2);
          }

          let activeRate = 0;
          $.each(value.rates[term], function (fee, valueRate) {
              if (percentFee >= fee)
                  activeRate = valueRate;
          });
          let rate = (activeRate + oneResult.add) / 100;
          let percentAmount = 0;
          for (let i = 1; i <= term; i++) {
              percentAmount += remainder * rate / 12;
              remainder -= constant;
          }

          let monthly = amount - initial + percentAmount;
          monthly = Math.ceil(-autoCalc.pmt((rate/ 12), (term-1), (amount - initial)));

          if (value.delay) {
              monthly = amount - initial - defer + percentAmount;
              monthly = (monthly / term);
              // term -= 1; // не понятно что это такое?
          }

          oneResult.result = {
              rate: (rate * 100).toFixed(2),
              monthly: monthly.toFixed(),
              amount: monthly,
              deferred: defer
          };

          resultsAuto.push(oneResult);
      }

  });

  let creditAmountVal = amount - initial;
  if (creditAmountVal < 0)
      creditAmountVal = 0;
  creditAmount.val(number_format(creditAmountVal, 0, "", " "));

  $('.js-calculator-programs-item').hide();
  $.each(resultsAuto, function (key, value) {

      let $this = $('.js-calculator-programs-item[data-id="' + value.id + '"]');
      $this.attr('data-rate', value.result["rate"]);
      $this.find('[data-result="monthly"]').text(number_format(value.result["monthly"], 0, "", " "));
      $this.find('[data-result="rate"]').text(value.result["rate"]);
      if (value.result["deferred"] > 0)
          $this.find('[data-result="deferred"]').text(number_format(value.result["deferred"], 0, "", " "));
      $this.show();
  });

  if (resultsAuto.length === 0) {
      notFound.show();
      found.hide();
  } else {
      notFound.hide();
      found.show();
  }

  sortResults();
}

function numberFormat(num) {
  if (!isFinite(num)) {
      return num;
  }

  var parts = num.toString().split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts.join('.');
}

function sortResults() {
  let $wrapper = $('.js-calculator-programs-results');
  $wrapper.find('.js-calculator-programs-item:visible').sort(function (a, b) {
      return +a.dataset.rate - +b.dataset.rate;
  }).appendTo($wrapper);
}

function graphics($params) {
  let remainder = $params.amount - $params.initial;
  let constant = Math.ceil(remainder / $params.term).toFixed(2);

  if ($params.defer > 0) {
      constant = ((remainder - $params.defer) / ($params.term - 1)).toFixed(2);
  }

  let results = '<table><colgroup><col style="width: 50px;"><col style="width: 150px;"><col style="width: 150px;"><col style="width: 150px;"><col style="width: 150px;"></colgroup><thead><tr><td>Месяцы</td><td>Сумма %</td><td>Сумма основного долга</td><td>Остаток основного долга</td><td class="td-weight-bold">Сумма к уплате</td></tr></thead><tbody>';
  let percentAmount = 0, amountMonth = 0, amountResult = 0;
  for (let i = 1; i <= $params.term; i++) {
      amountMonth = (remainder * $params.rate / 12).toFixed(2);
      if (amountMonth < 0)
          amountMonth = 0;

      percentAmount += remainder * $params.rate / 12;
      remainder = (remainder - constant).toFixed(2);
      if (remainder < 0)
          remainder = 0;

      amountResult = (parseFloat(amountMonth) + parseFloat(constant)).toFixed(2);

      if ($params.defer > 0 && $params.term - 1 == i) {
          remainder = $params.defer;
      } else if ($params.defer > 0 && $params.term == i) {
          constant = $params.defer;
          amountResult = 0;
          remainder = 0;
      }
      results += '<tr>';
      results += '<td>' + i + '</td>'; //месяцы
      results += '<td>' + number_format(amountMonth, 0, "", " ") + '</td>'; //сумма %
      results += '<td>' + number_format(constant, 0, "", " ") + '</td>'; //сумма ОД
      results += '<td>' + number_format(remainder, 0, "", " ") + '</td>'; //Остаток осн.долга
      results += '<td class="td-weight-bold">' + number_format(amountResult, 0, "", " ") + '</td>'; //Сумма к уплате
      results += '</tr>';
  }

  results += '</tbody></table>';
  return results;
}

function graphicsAnnuity($params) {
  let remainder = $params.amount - $params.initial;

  let results = '<table><colgroup><col style="width: 50px;"><col style="width: 150px;"><col style="width: 150px;"><col style="width: 150px;"><col style="width: 150px;"></colgroup><thead><tr><td>Месяцы</td><td>Сумма %</td><td>Сумма основного долга</td><td>Остаток основного долга</td><td class="td-weight-bold">Сумма к уплате</td></tr></thead><tbody>';
  let percentAmount = 0, amountMonth = 0, amountResult = 0, constant = 0;

  for (let i = 1; i <= $params.term; i++) {
      amountMonth = (remainder * $params.rate / 12).toFixed(2);
      if (amountMonth < 0)
          amountMonth = 0;

      if (i==1)
      {
          amountResult = (parseFloat(amountMonth) + parseFloat(constant)).toFixed(2);
      }
      else
      {
          amountResult = $params.monthly;
      }

      if (i==1)
      {
          constant = 0;
      }
      else
      {
          constant = amountResult-amountMonth;
      }

      percentAmount += remainder * $params.rate / 12;
      remainder = (remainder - constant).toFixed(2);
      if (remainder < 0)
          remainder = 0;

      /*if ($params.defer > 0 && $params.term - 1 == i) {
          remainder = $params.defer;
      } else if ($params.defer > 0 && $params.term == i) {
          amountResult = 0;
          remainder = 0;
      }*/
      results += '<tr>';
      results += '<td>' + i + '</td>'; //месяцы
      results += '<td>' + number_format(amountMonth, 0, "", " ") + '</td>'; //сумма %
      results += '<td>' + number_format(constant, 0, "", " ") + '</td>'; //сумма ОД
      results += '<td>' + number_format(remainder, 0, "", " ") + '</td>'; //Остаток осн.долга
      results += '<td class="td-weight-bold">' + number_format(amountResult, 0, "", " ") + '</td>'; //Сумма к уплате
      results += '</tr>';
  }

  results += '</tbody></table>';
  return results;
}
