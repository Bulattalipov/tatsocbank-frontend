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

  pmt: function (ratePerPeriod, numberOfPayments, presentValue, futureValue, type) {
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
    onStart: function (data) {
      min2 = min1 / 2;
      max2 = max1 / 2;
      from2 = max2 / 2;

      $input1.prop('value', numberFormat(data.from));
    },
    onChange: function (data) {
      $input1.prop('value', numberFormat(data.from));

      autoCalc._initialInputOption(data.from, instance2, $input2);
      auto($form);
    }
  });

  instance1 = $range1.data('ionRangeSlider');

  $input1.on('change keyup', function () {
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
    onStart: function (data) {
      $input2.prop('value', numberFormat(data.from));
    },
    onChange: function (data) {
      $input2.prop('value', numberFormat(data.from));
      auto($form);
    }
  });

  instance2 = $range2.data('ionRangeSlider');

  $input2.on('change keyup', function () {
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
    if (($(this).val() == 7) || ($(this).val() == 6)) {
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
    $('.js-number').on('keypress', function (key) {
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
    else {
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
      monthly = Math.ceil(-autoCalc.pmt((rate / 12), (term - 1), (amount - initial)));

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

    if (i == 1) {
      amountResult = (parseFloat(amountMonth) + parseFloat(constant)).toFixed(2);
    }
    else {
      amountResult = $params.monthly;
    }

    if (i == 1) {
      constant = 0;
    }
    else {
      constant = amountResult - amountMonth;
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

$(document).ready(function () {
  let $form = $('.js-form-calculator-deposit');

  let $range1 = $('.js-range-slider-deposit-1'),
    $input1 = $('.js-range-input-deposit-1'),
    min1 = $range1.data('min'),
    max1 = $range1.data('max'),
    from1 = $range1.data('value'),
    instance1,

    $range2 = $('.js-range-slider-deposit-2'),
    $input2 = $('.js-range-input-deposit-2'),
    min2 = $range2.data('min'),
    max2 = $range2.data('max'),
    from2 = $range2.data('value'),
    instance2;

  $range1.ionRangeSlider({
    min: min1,
    max: max1,
    from: from1,
    onStart: function (data) {
      $input1.prop('value', numberWithSpaces(data.from));
    },
    onChange: function (data) {
      $input1.prop('value', numberWithSpaces(data.from));
      deposit($form);
    }
  });

  instance1 = $range1.data('ionRangeSlider');

  $input1.on('change keyup', function () {
    var val = $(this).prop('value');

    if (val < min1) {
      val = min1;
    } else if (val > max1) {
      val = max1;
    }

    instance1.update({
      from: val
    });
  });

  $range2.ionRangeSlider({
    min: min2,
    max: max2,
    from: from2,
    onStart: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));
    },
    onChange: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));
      deposit($form);
    }
  });

  instance2 = $range2.data('ionRangeSlider');

  $input2.on('change keyup', function () {
    var val = $(this).prop('value');

    if (val < min2) {
      val = min2;
    } else if (val > max2) {
      val = max2;
    }

    instance2.update({
      from: val
    });
  });

  $(document).on('click change keyup keydown', '.js-deposit-action', function () {
    let $form = $(this).parents('form');
    deposit($form);
  });

  deposit($form);
});

function deposit($form) {
  let amount = toNumber($form.find('[name="start-amount"]').val()); // Сумма
  let term = toNumber($form.find('[name="deposit-term"]').val()); // Срок
  let daysTerm = term * 30; // срок в днях

  let capitalization = $form.find('[name="capitalization"]:checked').val(); // Капитализация
  let rechargeable = $form.find('[name="rechargeable"]:checked').val(); // Пополняемый
  let takeoff = $form.find('[name="takeoff"]:checked').val(); // можно снять
  let pension = $form.find('[name="pension"]:checked').val(); // пенсионные

  let notFound = $('.js-deposit-item-not-found');
  let found = $('.js-deposit-item-found');

  let resultsDeposit = [];
  $.each(allDeposit, function (key, value) {
    let add = true;
    let oneResult = {
      id: value.id
    };

    if (parseInt(value.min) > amount)
      add = false;


    if (capitalization !== undefined && value.capitalization !== capitalization) {
      add = false;
    }
    if (rechargeable !== undefined && value.rechargeable !== rechargeable) {
      add = false;
    }
    if (takeoff !== undefined && value.takeoff !== takeoff) {
      add = false;
    }
    if (value.pension == 'Y' && pension != 'Y') {
      add = false;
    }


    let addTerm = true;
    let activeRate = 0, activeDays = 0;
    $.each(value.rates, function (days, valueRate) {
      if (daysTerm >= days) {
        activeRate = valueRate / 100;
        activeDays = days;
        addTerm = false;
      }
    });
    if (addTerm)
      add = false;

    if (add) {
      //рассчитаем результат
      let x = 0;
      if (value.capitalization === 'Y') {

        let amountNew = amount;
        for (let i = 1; i <= term; i++) {
          x += amountNew * 30 * activeRate / 365;
          amountNew += x;
        }
        // 1- бессрочный, 2 - срочный
        if (value.type === '2') {
          x += (amount * (0.5 / 100) / 365) * (daysTerm - activeDays);
        }
      } else {
        // 1- бессрочный, 2 - срочный
        if (value.type === '1') {
          x = (amount * activeRate / 365) * daysTerm; // сумма начисленных процентов (руб.)
        } else {
          x = (amount * activeRate / 365) * activeDays + (amount * (0.5 / 100) / 365) * (daysTerm - activeDays);
        }
      }

      oneResult.result = {
        rate: activeRate > 0 ? (activeRate * 100).toFixed(2) : 0,
        amountPercent: x.toFixed(2),
        amountFull: (parseInt(x) + parseInt(amount)).toFixed(2)
      };

      resultsDeposit.push(oneResult);
    }

  });

  //console.log(resultsDeposit);

  $('.js-deposit-item').hide();
  $.each(resultsDeposit, function (key, value) {
    let $this = $('.js-deposit-item[data-id="' + value.id + '"]');
    $this.attr('data-rate', value.result["rate"]);
    $this.find('[data-result="amount"]').text(number_format(value.result["amountFull"], 0, "", " "));
    $this.find('[data-result="rate"]').text(value.result["rate"]);
    $this.show();
  });

  if (resultsDeposit.length === 0) {
    notFound.show();
    found.hide();
  } else {
    notFound.hide();
    found.show();
  }

  sortResultsDesc();

  //скроем больше 3х
  $.each($('.js-deposit-item:visible'), function (key, value) {
    let $this = $(value);
    if (key > 2)
      $this.hide();
  });
}

function sortResultsDesc() {
  let $wrapper = $('.js-deposit-results');
  $wrapper.find('.js-deposit-item:visible').sort(function (a, b) {
    return +b.dataset.rate - +a.dataset.rate;
  }).appendTo($wrapper);
}
let creditSum = 0;

$(document).ready(function () {
  function numberFormat(num) {
    if (!isFinite(num)) {
      return num;
    }

    var parts = num.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return parts.join('.');
  }

  let $form = $('.js-form-calculator-consumer');

  let
    $range2 = $('.js-range-slider-consumer-2'),
    $input2 = $('.js-range-input-consumer-2'),
    min2 = $range2.data('min'),
    max2 = $range2.data('max'),
    from2 = $range2.data('value'),
    instance2;

  creditSum = from2;

  $range2.ionRangeSlider({
    min: min2,
    max: max2,
    from: from2,
    onStart: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));
    },
    onChange: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));

      creditSum = $input2[0].value;

      getResult();
    }
  });

  instance2 = $range2.data('ionRangeSlider');

  $input2.on('change keyup', function () {
    var val = $(this).prop('value');

    if (val < min2) {
      val = min2;
    } else if (val > max2) {
      val = max2;
    }
    instance2.update({
      from: val
    });
  });

  function pmt(rate_per_period, number_of_payments, present_value, future_value, type) {
    if (rate_per_period != 0.0) {
      // Interest rate exists
      var q = Math.pow(1 + rate_per_period, number_of_payments);
      return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

    } else if (number_of_payments != 0.0) {
      // No interest rate, but number of payments exists
      return -(future_value + present_value) / number_of_payments;
    }

    return 0;
  }

  /**
   * Калькулятор потребительского кредита
   * Эта функция будет вызываться на любое изменение инпутов
   */
  function calculate(time, main, settings, depositType, paymentType, proofOfIncome, insurance) {
    // Рассчитаем ставку кредита rate
    let rate = settings.rates.default;

    // это средний ежемесячный платёж в первом случае и ежемесячный платёж во втором случае
    let average = 0;

    rate = settings.rates.depositType[depositType].rate;

    // if (settings.rates.year[time]) {
    //     rate = settings.rates.year[time];
    // }

    if (settings.rates.depositType[depositType].year) {
      rate = settings.rates.depositType[depositType].year[time];
    }

    if (!insurance) {
      rate += settings.rates.depositType[depositType].add;
    }

    if (settings.rates.proofOfIncome) {
      rate += settings.rates.proofOfIncome[proofOfIncome];
    }

    let sum = 0; // сумма платежа (итого)
    let percents = 0; // проценты (итого)

    let sumPayment = 0; // сумма платежа (месяц)
    let percent = 0; // проценты (месяц)
    let mainCredit = 0; // осн. долг (месяц)
    let sumLeft = 0; // остаток задолжности (месяц)

    if (paymentType == 1) {
      // первая итерация
      percent = main * rate / 12;
      mainCredit = main / time;
      sumLeft = main - mainCredit;
      sumPayment = percent + mainCredit;

      sum += sumPayment;
      percents += percent;

      for (let i = time - 1; i > 0; i--) {
        percent = (sumLeft * rate / 12 > 0) ? (sumLeft * rate / 12) : 0;
        mainCredit = (sumLeft > 0) ? ((sumLeft < mainCredit) ? sumLeft : mainCredit) : 0;
        sumLeft = (sumLeft - mainCredit > 0) ? (sumLeft - mainCredit) : 0;
        sumPayment = percent + mainCredit;

        sum += sumPayment;
        percents += percent;
      }

      average = sum / time;
    }

    if (paymentType == 2) {
      // первая итерация
      percent = main * rate / 12;
      mainCredit = 0;
      sumLeft = main - mainCredit;
      sumPayment = percent + mainCredit;

      sum += sumPayment;
      percents += percent;

      for (let i = time - 1; i > 0; i--) {
        percent = (sumLeft * rate / 12 > 0) ? (sumLeft * rate / 12) : 0;
        const PMT = pmt(rate / 12, time - 1, -main, 0, 0);
        sumPayment = (PMT < sumLeft) ? PMT : (sumLeft + percent);
        mainCredit = (i < time) ? (sumPayment - percent) : sumLeft;
        sumLeft = (sumLeft - mainCredit > 0) ? (sumLeft - mainCredit) : 0;

        sum += sumPayment;
        percents += percent;
      }

      average = sumPayment;
    }

    return {
      sum,
      percents,
      main,
      average,
      rate
    }
  }

  /**
   * Получает value инпутов формы
   */
  function getInputsValue(form) {

    let res = {};

    const inputs = form.querySelectorAll(".js-d-input");
    inputs.forEach(input => {
      res[input.name] = input.value;
    })

    res.creditSum = $input2[0].value;

    return res;
  }

  let settings = settings1;

  const resLabel = document.querySelector("#js-d-res-label");

  function getResult() {
    const container = document.querySelector(".js-consumer-results");
    if (!container) return;

    const form = document.querySelector("#js-main-page-consumer-calc");
    if (!form) return;

    const values = getInputsValue(form);

    if (values.depositType != 'n') {
      $('#js-hide-insurance').show();
    }
    else {
      $('#js-hide-insurance').hide();
    }

    values.creditSum = String(values.creditSum).replace(/\s/g, '');
    const result = calculate(
      Number(values.time),
      Number(values.creditSum),
      settings,
      values.depositType,
      values.paymentType,
      values.proofOfIncome,
      values.insurance
    );

    const monthPayment = container.querySelector(".result1");
    const rate = container.querySelector(".result2");
    const overPay = container.querySelector(".result4");

    monthPayment.textContent = numberFormat(Math.round(result.average));
    rate.textContent = Math.round(result.rate * 100 * 100) / 100;
    overPay.textContent = numberFormat(Math.round(result.percents));

    if (values.paymentType == 1) {
      resLabel.textContent = "Средний ежемесячный платёж"
    }
    if (values.paymentType == 2) {
      resLabel.textContent = "Ежемесячный платёж"
    }
  }

  getResult();

  $(document).on('click change keyup keydown', '.js-d-input', function () {
    getResult();
  });

  $(document).on('click change keyup keydown', '.js-d-update-range', function () {
    const depType = document.querySelector('.js-d-update-range').value;
    let newFrom = instance2.old_from;
    if (instance2.old_from > settings.rates.depositType[depType].maxSum) {
      newFrom = settings.rates.depositType[depType].maxSum
    }
    instance2.update({
      from: newFrom,
      max: settings.rates.depositType[depType].maxSum
    })
    $input2.prop('value', numberFormat(newFrom));

    getResult();
  });

  $(document).on('change', '.js-d-program-select', function () {
    const setting = $('.js-ddddd').find('[name="program"] option:selected');
    const sel1 = document.querySelector('#opt-sel-1');
    const sel2 = document.querySelector('#opt-sel-2');

    if (setting[0].value == 1) {
      settings = settings1;

      if (sel1) {
        sel1.removeAttribute('disabled');
        sel1.selected = true;
      }
      if (sel2) sel2.removeAttribute('selected');
      $('.bac-sel-dep').niceSelect('destroy');
      $('.bac-sel-dep').niceSelect();
      getResult()
    }
    else if (setting[0].value == 2) {
      settings = settings2;

      if (sel1) {
        sel1.disabled = true;
        sel1.removeAttribute('selected');
      }
      if (sel2) sel2.selected = true;
      $('.bac-sel-dep').niceSelect('destroy');
      $('.bac-sel-dep').niceSelect();
      getResult()
      // Здесь убираем пункт селекта "Без обеспечения", переключаем на следующий пункт
    }
    else if (setting[0].value == 3) {
      settings = settings3;

      if (sel1) {
        sel1.removeAttribute('disabled');
        sel1.selected = true;
      }
      if (sel2) sel2.removeAttribute('selected');
      $('.bac-sel-dep').niceSelect('destroy');
      $('.bac-sel-dep').niceSelect();
      getResult()
    }

    const depType = document.querySelector('.js-d-update-range').value;
    let newFrom = instance2.old_from;
    if (instance2.old_from > settings.rates.depositType[depType].maxSum) {
      newFrom = settings.rates.depositType[depType].maxSum
    }
    instance2.update({
      from: newFrom,
      max: settings.rates.depositType[depType].maxSum
    })
    $input2.prop('value', numberFormat(newFrom));

    getResult();
  });
});

function ipoteka($form, instanceTerm) {
  let wantSelect = $('[name="want"] option:selected');
  let want = wantSelect.val();
  let amount = toNumber($form.find('[name="ipoteka-amount"]').val()); // Сумма
  let initial = toNumber($form.find('[name="initial-fee"]').val()); // Первоначальный взнос
  let term = toNumber($form.find('[name="ipoteka-term"]').val()); // Срок
  let kapital = $form.find('[name="kapital"]:checked').val(); // Маткапитал
  let commission = $form.find('[name="commission"] option:selected').val(); //Единовременная комиссия


  $.each($('[data-want]'), function (i, el) {
    var $this = $(el);
    var ar = $this.data('want').split(',');
    if ($.inArray(want, ar) < 0) {
      $this.hide();
    } else {
      $this.show();
    }
  });

  let amountLabel = 'Стоимость недвижимости';
  let initialFeeLabel = 'Первоначальный взнос';

  switch (want) {
    case "c3":
    case "c6":
      amountLabel = 'Сумма кредита';
      initialFeeLabel = 'Размер залога';
      break;
    case "c5":
      amountLabel = 'Остаток долга';
      initialFeeLabel = 'Стоимость объекта недвижимости';
      break;
  }
  $form.find('[for="amount"]').text(amountLabel);
  $form.find('.js-initial-fee-text').text(initialFeeLabel);


  let percentFee = (initial / amount * 100).toFixed(2);
  if (want == 'c3' || want == 'c6') {
    percentFee = (amount / initial * 100).toFixed(2);
  }

  $('.js-ipoteka-fee').text(percentFee + '%').show();
  if (want == 'c5' || want == 'c3' || want == 'c6') {
    $('.js-ipoteka-fee').hide();
  }


  /* единовременная комиссия */
  let commissionValueInput = $form.find('[name="commission-value"]');
  let commissionValue = number_format((amount - initial) * commission / 100, 0, "", " ");
  if (want == 'c5' || want == 'c3' || want == 'c6') {
    commissionValue = number_format(amount * commission / 100, 0, "", " ");
  }
  if (commissionValue == 0) {
    commissionValue = '';
    $('.js-ipoteka-result-commission').hide();
  } else {
    $('.js-ipoteka-result-commission').show();
  }

  commissionValueInput.val(commissionValue);

  let resultsIpoteka = [];
  $.each(allIpoteka, function (key, value) {
    let add = true;
    let oneResult = {
      id: value.id,
      name: value.name,
    };

    if ($.inArray(want, value.want) < 0)
      add = false;

    if (value.min > amount)
      add = false;

    if (add) {
      //рассчитаем результат
      let activeRate = 0;

      if (want == 'c5') {

        let c5Cel = toNumber($form.find('[name="c5-cel"]').val());
        percentFee = (amount / initial * 100).toFixed(2);

        $.each(value.rates[c5Cel], function (termRate, rates2) {
          //рефинансирование
          if (term >= termRate) {
            $.each(rates2, function (fee, valueRate) {
              if (parseInt(percentFee) <= fee) {
                activeRate = valueRate;
                return false;
              }
            });
          }
        });
      } else {
        $.each(value.rates, function (termRate, rates2) {
          if (term >= termRate) {
            $.each(rates2, function (fee, valueRate) {
              if (percentFee >= fee)
                activeRate = valueRate;
            });
          }
        });
      }

      let dohod = parseFloat($form.find('[name="dohod"] option:selected').val());
      if (dohod > 0) {
        activeRate += dohod;
      }

      let cards = parseFloat($form.find('[name="cards"]:checked').val());
      if (cards > 0) {
        activeRate -= cards;
      }

      let businessman = parseFloat($form.find('[name="businessman"]:checked').val());
      if (businessman > 0) {
        activeRate -= businessman;
      }

      let employer = parseFloat($form.find('[name="employer"]:checked').val());
      if (employer > 0) {
        activeRate -= employer;
      }

      let activeRateWithoutCommission = activeRate;
      if (commission != '') {
        switch (commission) {
          case "2.5":
            activeRate -= 1;
            break;
          case "1":
            activeRate -= .5;
            break;
        }
      }

      oneResult.result = {
        rateBase: activeRateWithoutCommission > 0 ? (activeRateWithoutCommission / 100).toFixed(3) : 0,
        rate: activeRate > 0 ? (activeRate / 100).toFixed(3) : 0,
      };

      resultsIpoteka.push(oneResult);
    }
  });

  $.each(resultsIpoteka, function (key, value) {
    let $this = $('.js-ipoteka-item');
    $this.attr('data-rate', value.result["rate"]);
    // $this.find('[data-result="amount"]').text(number_format(value.result["amountFull"], 0, "", " "));
    // $this.find('[data-result="rate"]').text(value.result["rate"]);

    // $('#hypothecation-order [name="program"]').val(value.name);



    //let pay = (amount - initial) * ((parseFloat(value.result["rate"])*0.01) / (1 - param1));

    let cre = (amount - initial);
    let per = parseFloat(value.result["rate"]);
    let per_base = parseFloat(value.result["rateBase"]);
    let mes = term * 12;
    //let k_annuitet = per/12 * (Math.pow((1 + per/12), mes)) / ((Math.pow((1 + per/12), mes)) - 1);
    //let a_m_payment = Math.round(cre * k_annuitet);


    let k_annuitet = 1 - Math.pow(1 + per / 12, 0 - (mes + 2) + 2);
    let a_m_payment = Math.round((cre * per / 12) / k_annuitet);

    //сумма кредита
    let allAmount = (a_m_payment * term * 12).toFixed(0);

    //переплата по кредиту
    let overpayment = allAmount - cre;

    if (want == 'c5' || want == 'c3' || want == 'c6') {
      cre = initial;

      a_m_payment = Math.round((cre * per / 12) / k_annuitet);
      //a_m_payment = Math.round(cre * k_annuitet);
      allAmount = (a_m_payment * term * 12).toFixed(0);

      overpayment = allAmount - cre;


    }


    $this.find('[data-result="result1"]').text(number_format(a_m_payment, 0, "", " "));
    $this.find('[data-result="result2"]').text((value.result["rate"] * 100).toFixed(1));
    $this.find('[data-result="result3"]').text(number_format(cre, 0, "", " "));
    $this.find('[data-result="result4"]').text(number_format(overpayment, 0, "", " "));



    //let k_annuitet_base = parseFloat(value.result["rateBase"])/12 * (Math.pow((1 + parseFloat(value.result["rateBase"])/12), mes)) / ((Math.pow((1 + parseFloat(value.result["rateBase"])/12), mes)) - 1);
    //let a_m_payment_base = Math.round(cre * k_annuitet_base);
    let k_annuitet_base = 1 - Math.pow(1 + per_base / 12, 0 - (mes + 2) + 2);
    let a_m_payment_base = Math.round((cre * per_base / 12) / k_annuitet_base);

    let allAmountBase = (a_m_payment_base * term * 12).toFixed(0);

    //выгода от комиссии
    let commissionValue = (amount * commission / 100).toFixed(0);
    let dismissPay = allAmountBase - allAmount - parseFloat(commissionValue);
    //console.log(allAmountBase + ' - ' + allAmount + ' - ' + commissionValue)
    $this.find('[data-result="result5"]').text(number_format(dismissPay, 0, "", " "));
    $this.find('[data-result="result5"]').removeClass('good').removeClass('bad');
    if (dismissPay > 0) {
      $this.find('[data-result="result5"]').addClass('good');
    } else if (dismissPay < 0) {
      $this.find('[data-result="result5"]').addClass('bad');
    }


    // console.log('amount: ' + amount);
    // console.log('commissionValue: ' + commissionValue);
    // console.log('per: ' + per);
    // console.log('per_base: ' + per_base);
    // console.log('k_annuitet: ' + k_annuitet);
    // console.log('k_annuitet_base: ' + k_annuitet_base);
    // console.log('a_m_payment: ' + a_m_payment);
    // console.log('a_m_payment_base: ' + a_m_payment_base);

    //необходимый доход
    let income;
    if (kapital == 'Y') {
      income = ((allAmount / 1.2) - 453026) / (term * 12) + 18391; //9450
    } else {
      income = allAmount / (term * 12 * 1.2) + 18391; //9450
    }
    $this.find('[data-result="result6"]').text(number_format(income, 0, "", " "));

  });
}

ipoteka($form, instanceTerm);
