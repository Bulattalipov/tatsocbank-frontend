/* eslint-disable */

$(document).ready(function () {
  function transferPrimaryData (){
    let $range1 = $('.js-range-slider-deposit-1'),
        $range2 = $('.js-range-slider-deposit-2');

    $range1.attr("data-min", depositDetals.min);

    if(depositDetals.max) {
      $range1.attr("data-max", depositDetals.max);
    }

    let $blockContainer = $('.js-deposit-item');
    $blockContainer.attr("data-id", depositDetals.id);
  }

  transferPrimaryData();

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
      var val = toNumber($(this).prop('value').replace(/\s+/, ''));

      if(!val) {
        val = 0;
      }

      if (val < min1) {
          val = min1;
      } else if (val > max1) {
          val = max1;
      }

      instance1.update({
          from: val
      });

      $(this).prop("value", val);
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

  let resultsDeposit = [];

  let add = true;
  let oneResult = {
      id: depositDetals.id
  };

  let addTerm = true;
  let activeRate = 0, activeDays = 0;
  $.each(depositDetals.rates, function (days, valueRate) {
      if (daysTerm >= days) {
          activeRate = valueRate / 100;
          activeDays = days;
          addTerm = false;
      }
  });

  if (add) {
      //рассчитаем результат
      let x = 0;
      if (depositDetals.capitalization === 'Y') {

          let amountNew = amount;
          for (let i = 1; i <= term; i++) {
              x += amountNew * 30 * activeRate / 365;
              amountNew += x;
          }
          // 1- бессрочный, 2 - срочный
          if (depositDetals.type === '2') {
              x += (amount * (0.5 / 100) / 365) * (daysTerm - activeDays);
          }
      } else {
          // 1- бессрочный, 2 - срочный
          if (depositDetals.type === '1') {
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

  $.each(resultsDeposit, function (key, value) {
      let $this = $('.js-deposit-item[data-id="' + value.id + '"]');
      $this.attr('data-rate', value.result["rate"]);
      $this.find('[data-result="amount"]').text(number_format(value.result["amountFull"], 0, "", " "));
      $this.find('[data-result="rate"]').text(value.result["rate"]);
      $this.show();
  });
}

