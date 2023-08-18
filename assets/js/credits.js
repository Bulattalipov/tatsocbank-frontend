/* eslint-disable */

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

    function pmt(rate_per_period, number_of_payments, present_value, future_value, type){
        if(rate_per_period != 0.0){
            // Interest rate exists
            var q = Math.pow(1 + rate_per_period, number_of_payments);
            return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

        } else if(number_of_payments != 0.0){
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

        values.creditSum = String(values.creditSum).replace(/\s/g, '').replace(/\₽/g, '');
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
          resLabel.setAttribute("data-text", "Средний ежемесячный платёж")
        }
        if (values.paymentType == 2) {
          resLabel.setAttribute("data-text", "Ежемесячный платёж")
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
