Box.Application.addModule('cc-validation-form', function(context) {

    'use strict';

    var creditCardService,
        moduleEl;

    return {

        init: function() {
            creditCardService = context.getService('credit-card');
            moduleEl = context.getElement();
        },

        destroy: function() {
            moduleEl = null;
            creditCardService = null;
        },

        onclick: function(event, element, elementType) {
            console.log(moduleEl.querySelectorAll('input '));
            if (elementType === 'validate-btn') {

                var number = moduleEl.querySelector('[name="cc-number"]').value,
                    month = parseInt(moduleEl.querySelector('[name="cc-exp-month"]').value, 10),
                    year = parseInt(moduleEl.querySelector('[name="cc-exp-year"]').value, 10);

                if (creditCardService.isValid(number, month, year)) {
                    this.setMessage("Card is valid!");
                } else {
                    this.setMessage("Card is invalid!");
                }
                event.preventDefault();
            }

        },

        setMessage: function(message) {
            var messageEl = moduleEl.querySelector('.message');
            messageEl.innerText = message;
        }
    };

});


Box.Application.addService('credit-card', function(application) {

    'use strict';

    //--------------------------------------------------------
    // Private
    //--------------------------------------------------------

    function doLuhnCheck(ccNumber) {
        if (/[^0-9-\s]+/.test(ccNumber)) {
            return false;
        }

        var checksum = 0,
            digit = 0,
            isEven = false;

        ccNumber = ccNumber.replace(/\D/g, "");

        for (var n = ccNumber.length - 1; n >= 0; n--) {
            digit = parseInt(ccNumber.charAt(n), 10);

            if (isEven) {
                if ((digit *= 2) > 9) {
                    digit -= 9;
                }
            }

            checksum += digit;
            isEven = !isEven;
        }

        return (checksum % 10) == 0;
    }

    //---------------------------------------------------------
    // Public
    //---------------------------------------------------------

    return {

        isValid: function(ccNumber, month, year) {
            return this.isValidNumber(ccNumber) && !this.isExpired(month, year);
        },

        isValidNumber: function(ccNumber) {
            return doLuhnCheck(ccNumber);
        },

        isExpired: function(month, year) {
            var currentDate = new Date(),
                currentYear = currentDate.getFullYear();

            if (currentYear > year) {
                return true;
            } else if (currentYear === year
                    && (month - 1) < currentDate.getMonth()) {
                // Months are zero-indexed, Jan = 0, Feb = 1...
                return true;
            } else {
                return false;
            }
        }

    };

});