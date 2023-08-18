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
  let daysTerm = term * 30; // Срок в днях

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
    if (pension !== undefined && value.pension !== pension) {
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
    if(key > 2)
      $this.hide();
  });
}

function sortResultsDesc() {
  let $wrapper = $('.js-deposit-results');
  $wrapper.find('.js-deposit-item:visible').sort(function (a, b) {
    return +b.dataset.rate - +a.dataset.rate;
  }).appendTo($wrapper);
}
