class CurrencyInput {
    constructor(target, options = {}) {
        this.target = (typeof target == 'string') ? document.querySelector(target) : target;
        this.reinit(options);
        this.lastKeyDead = false;
        this.target.addEventListener('cut', this.validateInput.bind(this));
        this.target.addEventListener('paste', this.validateInput.bind(this));
        this.target.addEventListener('keydown', this.validateInput.bind(this));
        this.target.addEventListener('compositionend', this.validateInput.bind(this));
        this.target.addEventListener('drop', function () {
            event.preventDefault();
        });
        this.target.addEventListener('input', this.format.bind(this));

    }
    format(event) {
        const sap = this.getCurrencySymbolAndPosition();
        const decimalChar = this.getDecimalCharacter();
        const separationChar = this.getSeparationCharacter();
        let input = this.defaultValue;
        const jumpAhead = (this.target.value.length == 1 && sap.displayBefore) ? sap.symbol.length : 0;
        if (typeof event != 'undefined') {
            input = this.getEventValue(event).replaceAll(sap.symbol, '');
            var sepBef = (separationChar != '') ? input.length : 0;
            if (separationChar != '') input = input.replaceAll(new RegExp('\\'+separationChar, 'g'), '');
            input = input.replaceAll(new RegExp('\\'+decimalChar, 'g'), '.').replaceAll(/\s/g,'');
            const decimalRegex = new RegExp(`^[^\\.]*\\.(\\d{0,${this.getCurrencyDecimalCount()}})?$`)
            var endsWithDecimalBreak = input.match(decimalRegex) != null;
            if (endsWithDecimalBreak) {
                input += '1';
            }
            if (input == '-' && sap.displayBefore) {
                this.target.value = '-' + sap.symbol;
                return;
            }
            if (input == '' || input == sap.symbol.replaceAll(/\s/g,'')) {
                this.target.value = '';
                return;
            }
            input = parseFloat(input);
        }
        if (isNaN(input)) return;
        input = input.toLocaleString(this.locale);
        if (endsWithDecimalBreak) {
            input = input.slice(0, -1);
        }
        input = input.replaceAll(new RegExp('\\'+this.getDecimalCharacter(true),'g'), '/');
        input = input.replaceAll(new RegExp('\\'+this.getSeparationCharacter(true),'g'), separationChar);
        input = input.replaceAll('/', decimalChar);
        const start = this.target.selectionStart;
        const end = this.target.selectionEnd;
        const sepAft = (separationChar != '') ? input.length : 0;
        if (sap.displayBefore) {
            this.target.value = (input < 0) ? '-' + sap.symbol + input.substring(1) : sap.symbol + input;
        } else {
            this.target.value = input + sap.symbol;
        }
        const sepShift = (isNaN(sepAft - sepBef)) ? 0 : sepAft - sepBef;
        this.target.selectionStart = start + sepShift + jumpAhead;
        this.target.selectionEnd = end + sepShift + jumpAhead;
    }
    reinit(options) {
        this.currencyCodes = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MUR', 'MVR', 'MWK', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'];
        if (typeof options.currency != 'undefined' && !this.currencyCodes.includes(options.currency)) throw new TypeError(options.currency + 'is an unknown currency code. Refer to ISO 4217 for a list of valid codes or leave empty to default to USD.');
        this.currency = (typeof options.currency == 'string') ? options.currency : 'USD';
        this.locale = (typeof options.locale == 'string') ? options.locale : 'en-US';
        this.currencyDisplay = (typeof options.currencyDisplay == 'string') ? options.currencyDisplay : 'symbol';
        this.currencyDisplayFallback = (typeof options.currencyDisplayFallback == 'string') ? options.currencyDisplayFallback : 'code';
        this.decimalCharacter = options.decimalCharacter;
        this.separationCharacter = options.separationCharacter;
        if (this.getDecimalCharacter() == this.getSeparationCharacter()) {
            throw new TypeError('Decimal and separation characters must not be the same.');
        }

        if (this.getDecimalCharacter() == '/' || this.getSeparationCharacter() == '/') {
            throw new TypeError('The devider characters must not be a forward slash.');
        }

        this.disableCents = (typeof options.disableCents == 'boolean' && options.disableCents == true) ? true : false;
        this.preventInputFromIME = (typeof options.preventInputFromIME != 'undefined' && typeof options.preventInputFromIME == 'boolean' && options.preventInputFromIME == false) ? false : true;
        this.min = (typeof options.min == 'number') ? options.min : false;
        this.max = (typeof options.max == 'number' && (options.max >= this.min || this.min === false)) ? options.max : false;
        this.validCallback = (typeof options.validCallback == 'function') ? options.validCallback : false;
        this.invalidCallback = (typeof options.invalidCallback == 'function') ? options.invalidCallback : false;
        if (typeof options.defaultValue == 'number') {
            this.validateInput({
                type: 'keydown',
                key: options.defaultValue,
                target: this.target,
                synthetic: true
            });
            this.defaultValue = options.defaultValue;
        } else {
            this.target.value = '';
        }
        this.format();
    }
    getCurrencySymbolAndPosition() {
        if (this.currencyDisplay === 'none') return { displayBefore: false, symbol: '' }
        if (this.currencyDisplay == 'symbol') {
            var symbol = (0).toLocaleString(this.locale, {
                style: 'currency',
                currency: this.currency,
                currencyDisplay: 'symbol',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else if (this.currencyDisplay == 'code') {
            var symbol = (0).toLocaleString(this.locale, {
                style: 'currency',
                currency: this.currency,
                currencyDisplay: 'code',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }

        if (this.currencyDisplay == 'name' || symbol.replaceAll(/\d/g, '').trim() == this.currency && this.currencyDisplayFallback == 'name') {
            return {
                displayBefore: false,
                symbol: ' ' + new Intl.DisplayNames(this.locale, {type: 'currency'}).of(this.currency)
            }
        }

        if (this.currencyDisplay == 'symbol' && symbol.replaceAll(/\d/g, '').trim() == this.currency && this.currencyDisplayFallback == 'none') {
            return {
                displayBefore: false,
                symbol: ''
            }
        }

        return {
            displayBefore: symbol.indexOf(0) != 0,
            symbol: symbol.replaceAll(/\d/g, '')
        }
    }
    getDecimalCharacter(getOriginal = false) {
        if (this.getCurrencyDecimalCount() == 0) return '\\';
        if (typeof this.decimalCharacter != 'string' || getOriginal) {
            return (0).toLocaleString(this.locale, {
                style: 'currency',
                currency: this.currency,
                currencyDisplay: 'code',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }).replace(this.currency, '').replaceAll(/(\d)*/g, '').trim()[0];
        }
        return this.decimalCharacter[0];
    }
    getSeparationCharacter(getOriginal = false) {
        if (typeof this.separationCharacter != 'string' || getOriginal) {
            return (1000).toLocaleString(this.locale, {
                style: 'currency',
                currency: this.currency,
                currencyDisplay: 'code',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).replace(this.currency, '').replaceAll(/(\d)*/g, '').trim()[0];
        }
        return this.separationCharacter == '' ? '' : this.separationCharacter[0];
    }
    getCurrencyDecimalCount() {
        const decimalTest = new Intl.NumberFormat('en', { style: 'currency', currency: this.currency, signDisplay: 'never', currencyDisplay: 'code' }).format(1).substr(4);
        return (decimalTest.match(/(0)/g) || []).length;
    }
    getEventValue(e) {
        const clearKey = ['Control', 'Shift', 'CapsLock', 'Alt', 'Command', 'AltGraph', 'Meta', 'ContextMenu', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'End', 'Home', 'Insert'];
        if (e.type == 'keydown' && (clearKey.includes(e.key) || e.ctrlKey) && !(e.ctrlKey && e.key == 'Backspace') && !(e.key == 'Backspace' && e.metaKey) && !(e.ctrlKey && e.key == 'Delete') && !(e.metaKey && e.key == 'Delete')) return e.target.value;
        if (e.type == 'paste' || e.type == 'cut') return e.target.value.slice(0,e.target.selectionStart) + e.clipboardData.getData('text/plain') + e.target.value.slice(e.target.selectionEnd);
        if (e.type == 'keydown' && e.key != 'Backspace' && e.key != 'Delete') return e.target.value.slice(0,e.target.selectionStart) + e.key + e.target.value.slice(e.target.selectionEnd);
        if (e.type == 'keydown' && (e.key == 'Backspace' || e.key == 'Delete')) {
            const testCtrl = (navigator.userAgent.indexOf('Mac OS X') != -1) ? e.metaKey : e.ctrlKey;
            if (testCtrl && e.target.selectionStart == e.target.selectionEnd) {
                if (e.key == 'Delete') {
                    return e.target.value.slice(0, e.target.selectionStart);
                } else {
                    return e.target.value.slice(e.target.selectionStart, e.target.value.length);
                }
            }
            if (e.target.selectionStart != e.target.selectionEnd) {
                return e.target.value.slice(0,e.target.selectionStart) + e.target.value.slice(e.target.selectionEnd);
            } else {
                if (e.key == 'Delete') {
                    return e.target.value.slice(0,e.target.selectionStart) + e.target.value.slice(e.target.selectionEnd + 1);
                } else {
                    return e.target.value.slice(0,e.target.selectionStart - 1) + e.target.value.slice(e.target.selectionEnd);
                }
            }
        }
        return e.target.value;
    }
    getValueAsString() {
        return this.target.value;
    }
    getValueAsFloat() {
        let value = this.target.value
            .replaceAll(this.getCurrencySymbolAndPosition().symbol, '')
            .replaceAll(new RegExp('\\'+this.getSeparationCharacter(), 'g'), '')
            .replaceAll(new RegExp('\\'+this.getDecimalCharacter(), 'g'), '.')
            .replaceAll(/\s/g,'');
        return parseFloat(value);
    }
    getValueAsInt() {
        const float = this.getValueAsFloat();
        const decimals = this.getCurrencyDecimalCount();
        return float * Math.pow(10, decimals);
    }
    validateInput(e) {
        const sap = this.getCurrencySymbolAndPosition();
        const sepChar = this.getSeparationCharacter();
        let input = this.getEventValue(e).replaceAll(sap.symbol, '').replaceAll(/\s/g,'');
        if (sepChar != '') input = input.replaceAll(new RegExp('\\'+sepChar, 'g'), '')
        const decimalChar = this.getDecimalCharacter();
        const decimals = this.getCurrencyDecimalCount();
        let regex = '^';
        if (this.min < 0 || this.min === false) regex += '(\\-)?';
        if (decimals == 0 || this.disableCents) {
            regex += '([1-9]*|[1-9]{1}\\d*)';
        } else {
            regex += '([1-9]*|0|[1-9]{1}[0-9]*){1}((?<=\\d)[\\' + decimalChar + ']\\d{0,' + decimals + '})?';
        }
        regex += '$';
        if (input == '-') {
            var checkValue = 0;
        } else {
            if (input.slice(-1) == decimalChar) {
                var checkValue = parseFloat(input.replace(new RegExp('\\'+decimalChar), '.') + Math.pow(10, -decimals).toString().replace('0.', ''));
            } else {
                var checkValue = parseFloat(input.replace(new RegExp('\\'+decimalChar), '.'));
            }
        }
        if (input.match(new RegExp(regex)) === null ||
        (this.min !== false && checkValue < this.min) ||
        (this.max !== false && checkValue > this.max) ||
        checkValue > 999999999999999 / Math.pow(10, (this.disableCents ? 0 : decimals)) ||
        checkValue < -999999999999999 / Math.pow(10, (this.disableCents ? 0 : decimals)) ||
        this.getEventValue(e).includes('-'+this.getSeparationCharacter())) {
            if (this.preventInputFromIME && e.type == 'compositionend') this.target.value = this.target.value.replace(e.data, '');
            if (typeof this.invalidCallback == 'function' && this.target.value != input) this.invalidCallback();
            if (typeof e.synthetic == 'undefined') e.preventDefault();
        } else {
            if (typeof this.validCallback == 'function' && input != this.target.value) this.validCallback();
            if (typeof e.synthetic != 'undefined') this.target.value = e.key;
        }

        if (this.lastKeyDead) this.target.blur();
        this.lastKeyDead = e.type == 'keydown' && e.key == 'Dead';

    }
}
