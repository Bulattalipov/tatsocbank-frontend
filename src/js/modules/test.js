/* eslint-disable */

$(document).ready(function () {
  let $form = $('.js-form-calculator-ipoteka');

  let $range1 = $('.js-range-slider-ipoteka-1'),
    $input1 = $('.js-range-input-ipoteka-1'),
    min1 = $range1.data('min'),
    max1 = $range1.data('max'),
    from1 = $range1.data('value'),
    instance1,

    $range2 = $('.js-range-slider-ipoteka-2'),
    $input2 = $('.js-range-input-ipoteka-2'),
    min2 = $range2.data('min'),
    max2 = $range2.data('max'),
    from2 = $range2.data('value'),
    instance2,

    $range3 = $('.js-range-slider-ipoteka-3'),
    $input3 = $('.js-range-input-ipoteka-3'),
    min3 = $range3.data('min'),
    max3 = $range3.data('max'),
    from3 = $range3.data('value'),
    instance3;

  $range2.ionRangeSlider({
    min: min2,
    max: max2,
    from: from2,
    onStart: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));
    },
    onChange: function (data) {
      $input2.prop('value', numberWithSpaces(data.from));
      ipoteka($form, instance3);
    }
  });

  instance2 = $range2.data('ionRangeSlider');

  $range1.ionRangeSlider({
    min: min1,
    max: max1,
    from: from1,
    onStart: function (data) {
      $input1.prop('value', numberWithSpaces(data.from));
      setInitialMinMax(instance2, data.from);
    },
    onChange: function (data) {
      $input1.prop('value', numberWithSpaces(data.from));

      setInitialMinMax(instance2, data.from);

      ipoteka($form, instance3);
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

  $range3.ionRangeSlider({
    min: min3,
    max: max3,
    from: from3,
    onStart: function (data) {
      $input3.prop('value', data.from);
    },
    onChange: function (data) {
      $input3.prop('value', data.from);

      $('.js-ipoteka-term-label').text(num2str(data.from, ['год', 'года', 'лет']));

      ipoteka($form, instance3);
    }
  });

  instance3 = $range3.data('ionRangeSlider');

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

  if ($('.js-form-calculator-ipoteka [name="ipoteka-amount"]').length) {
    let amount = toNumber($('.js-form-calculator-ipoteka [name="ipoteka-amount"]').val());
    $('.js-form-calculator-ipoteka [name="initial-fee"]').val(number_format(parseFloat(amount) * 0.15, 0, "", " "));
    instance3.update({
      from: parseFloat(amount) * 0.2
    });
  }

  // три взаимоисключающихся checkbox-a
  $('[name = cards]').change(function () {
    if ($(this).is(":checked")) {
      $('[name = businessman]').prop('checked', false);
      $('[name = employer]').prop('checked', false);

      let amount = toNumber($form.find('[name="ipoteka-amount"]').val());
      setInitialMinMax(instance2, amount);
    }
  });
  $('[name = businessman]').change(function () {
    if ($(this).is(":checked")) {
      $('[name = cards]').prop('checked', false);
      $('[name = employer]').prop('checked', false);
    }
  });
  $('[name = employer]').change(function () {
    if ($(this).is(":checked")) {
      $('[name = cards]').prop('checked', false);
      $('[name = businessman]').prop('checked', false);
    }
  });

  $(document).on('click change keyup keydown', '.js-ipoteka-action', function () {
    let $form = $(this).parents('form');
    ipoteka($form, instance3);
  });

  $(document).on('click change keyup keydown', '.js-ipoteka-action-want, [name="c5-cel"]', function () {
    let $form = $(this).parents('form');
    changeWant($form, instance1, instance3);
  });

  $(document).on('click change keyup keydown', '[name="kapital"]', function () {
    let $form = $(this).parents('form');
    let amount = toNumber($form.find('[name="ipoteka-amount"]').val());

    setInitialMinMax(instance2, amount);
  });

  $(document).on('click change keyup keydown', '.js-ipoteka-action', function () {
    let $form = $(this).parents('form');
    let amount = toNumber($form.find('[name="ipoteka-amount"]').val());
    setInitialMinMax(instance2, amount);
  });

  changeWant($form, instance1, instance3);
  ipoteka($form, instance3);
});

function num2str(n, text_forms) {
  n = Math.abs(n) % 100; var n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}

function setInitialMinMax(instance, val) {

  let $form = $('.js-form-calculator-ipoteka');
  let kapital = $form.find('[name="kapital"]:checked').val(); // Маткапитал
  let cards = $form.find('[name=cards]');
  let wantSelect = $('[name="want"] option:selected');
  let dataWant = wantSelect.data('fee-m');
  let want = wantSelect.val();
  let fee;

  if ((kapital === 'Y' || cards.is(':checked')) && dataWant && dataWant != "") {
    fee = wantSelect.data('fee-m').split(',');
  } else {
    fee = wantSelect.data('fee').split(',');
  }

  if (want == 'c5' || want == 'c3' || want == 'c6') {
    fee = [125, 1500];
  }

  let $initialFeeBlock = $('.js-ipoteka-fee-item');
  let $initialFeeInput = $('.js-range-input-ipoteka-2');


  $initialFeeBlock.show();

  let valMin = val * fee[0] / 100;
  let valMax = val * fee[1] / 100;

  let inputFeeValue = toNumber($initialFeeInput.val());

  if (inputFeeValue < valMin) {
    $initialFeeInput.val(number_format(valMin, 0, "", " "));

    instance.update({
      from: valMin
    });
  } else if (inputFeeValue > valMax) {
    $initialFeeInput.val(number_format(valMax, 0, "", " "));
    instance.update({
      from: valMax
    });
  }

  //$initialFeeInput.val(valMin);

  instance.update({
    min: valMin,
    max: valMax
  });

  let percentFee = (toNumber($initialFeeInput.val()) / toNumber($('.js-range-input-ipoteka-1').val()) * 100).toFixed(2);
  $('.js-ipoteka-fee').text(percentFee + '%');


}

function changeWant($form, instanceAmount, instanceTerm) {

  let wantSelect = $('[name="want"] option:selected');
  let want = wantSelect.val();
  let propities = wantSelect.data('customProperties');
    propities = propities.replace(/'/g, '"');
    propities = JSON.parse(propities);
  let year = propities['data-year'].split(',');
  let term = toNumber($form.find('[name="ipoteka-term"]').val()); // Срок
  let minSum = 300000;

  if (want == 'c5') {
    let propities2 = $('[name="c5-cel"] option:selected').data('customProperties');
    propities2 = propities2.replace(/'/g, '"');
    propities2 = JSON.parse(propities2);
    year = propities2['data-year'].split(',');
    instanceAmount.update({
      min: minSum
    });
  } else {
    if (want !== 'c8')
      minSum = 100000;

    instanceAmount.update({
      min: minSum
    });
  }


  instanceTerm.update({
    min: year[0],
    max: year[1]
  });

  if (term < year[0]) {
    $form.find('[name="ipoteka-term"]').val(year[0]);
    instanceTerm.update({
      from: year[0]
    });
  } else if (term > year[1]) {
    $form.find('[name="ipoteka-term"]').val(year[1]);
    instanceTerm.update({
      from: year[1]
    });
  }
}

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
    $this.find('[data-result="amount"]').text(number_format(value.result["amountFull"], 0, "", " "));
    $this.find('[data-result="rate"]').text(value.result["rate"]);

    $('#hypothecation-order [name="program"]').val(value.name);



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

  /*   if (resultsIpoteka.length === 0) {
         notFound.show();
         found.hide();
     } else {
         notFound.hide();
         found.show();
     }*/

}
