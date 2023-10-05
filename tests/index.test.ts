import userEvent from '@testing-library/user-event';
import IntlCurrencyInput from "../src";
import {DisplayOrder, Money, MyriadMode} from "moneydew";

describe('CurrencyInput', () => {

    let input: IntlCurrencyInput;
    let inputElement: HTMLInputElement;
    beforeEach(() => {
        // Create a container div and append it to the document body
        document.body.innerHTML =
            '<!-- index.html -->\n' +
            '<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
            '    <title>Custom Input Test</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div>' +
            '<input id="inputElementOne"/>' +
            '<input id="inputElementTwo"/>' +
            '</div>\n' +
            '</body>\n' +
            '</html>\n';
        inputElement = document.querySelector('#inputElementOne') as HTMLInputElement;
        input = new IntlCurrencyInput(inputElement, '0.00', {});
    });
    afterEach(() => {
       input.unmount();
    });

    it('should format and update the value',  async () => {
        expect(inputElement.value).toBe('$0.00');

        await userEvent.type(inputElement,    '4', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$40.00');
        expect(input.getValue()).toBe('40.00');
        expect(input.getFormattedValue()).toBe('$40.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 4,
            initialSelectionEnd: 6,
        });

        expect(inputElement.value).toBe('$40.');
        expect(input.getValue()).toBe('40.00');
        expect(input.getFormattedValue()).toBe('$40.00');

        await userEvent.type(inputElement,    '5', {
            initialSelectionStart: 4,
            initialSelectionEnd: 4,
        });

        expect(inputElement.value).toBe('$40.5');
        expect(input.getValue()).toBe('40.50');
        expect(input.getFormattedValue()).toBe('$40.50');

        await userEvent.type(inputElement,    '9', {
            initialSelectionStart: 5,
            initialSelectionEnd: 5,
        });

        expect(inputElement.value).toBe('$40.59');
        expect(input.getValue()).toBe('40.59');
        expect(input.getFormattedValue()).toBe('$40.59');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 4,
            initialSelectionEnd: 4,
        });

        expect(inputElement.value).toBe('$4,059');
        expect(input.getValue()).toBe('4059.00');
        expect(input.getFormattedValue()).toBe('$4,059.00');

        await userEvent.type(inputElement,    '7', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });

        expect(inputElement.value).toBe('$47,059');
        expect(input.getValue()).toBe('47059.00');
        expect(input.getFormattedValue()).toBe('$47,059.00');

        await userEvent.type(inputElement,    '.00', {
            initialSelectionStart: 7,
            initialSelectionEnd: 7,
        });

        expect(inputElement.value).toBe('$47,059.00');
        expect(input.getValue()).toBe('47059.00');
        expect(input.getFormattedValue()).toBe('$47,059.00');

        await userEvent.type(inputElement,    '3', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });

        expect(inputElement.value).toBe('$473,059.00');
        expect(input.getValue()).toBe('473059.00');
        expect(input.getFormattedValue()).toBe('$473,059.00');

        await userEvent.type(inputElement,    '9', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });

        expect(inputElement.value).toBe('$4,793,059.00');
        expect(input.getValue()).toBe('4793059.00');
        expect(input.getFormattedValue()).toBe('$4,793,059.00');

        await userEvent.type(inputElement,    '123', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$1,234,793,059.00');
        expect(input.getValue()).toBe('1234793059.00');
        expect(input.getFormattedValue()).toBe('$1,234,793,059.00');

        await userEvent.type(inputElement,    '1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$1,234,793,059.00');
        expect(input.getValue()).toBe('1234793059.00');
        expect(input.getFormattedValue()).toBe('$1,234,793,059.00');

        input.unmount();
        input = new IntlCurrencyInput(inputElement);

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(input.getFormattedValue()).toBe('$0.00');

        await userEvent.type(inputElement,    '1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');
        expect(input.getFormattedValue()).toBe('$10.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(input.getFormattedValue()).toBe('$0.00');

        const otherInputElement = document.querySelector('#inputElementTwo') as HTMLInputElement;
        input.unmount();
        input = new IntlCurrencyInput(otherInputElement as HTMLInputElement);


        await userEvent.type(otherInputElement,'1', {
            initialSelectionStart: 0,
            initialSelectionEnd: 0,
        });

        expect(otherInputElement.value).toBe('$0.00');
        expect(inputElement.value).toBe('$0.00');

        await userEvent.type(inputElement,'1', {
            initialSelectionStart: 0,
            initialSelectionEnd: 0,
        });

        expect(otherInputElement.value).toBe('$0.00');
        expect(inputElement.value).toBe('1$0.00');

    });

    it('should be usable for percentages', async () => {
        input.format({
            displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            currencyName: '',
            currencySymbol: '%',
            groupSeparator: '',
            decimalSeparator: '.'
        });
        input.setValue('20');
        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getValue()).toBe('0');
        expect(inputElement.value).toBe('0%');

        input.format({
            currencyName
                :
                "USD",
            currencySymbol
                :
                "$",
            decimalSeparator
                :
                ",",
            displayOrder
                :
                14,
            groupSeparator
                :
                "."
        });
        await userEvent.type(inputElement,    'a', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getValue()).toBe('0');
        expect(inputElement.value).toBe('USD 0$');
    });

    it('should insert a zero when all numbers before decimal point are deleted', async () => {
        input.setValue('123.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 4,
        });
        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        input.setValue('123.00');
        await userEvent.type(inputElement,    '{backspace}{backspace}{backspace}{backspace}{backspace}', {
            initialSelectionStart: 7,
            initialSelectionEnd: 7,
        });
        expect(inputElement.value).toBe('$1');
        expect(input.getFormattedValue()).toBe('$1.00');
        expect(input.getValue()).toBe('1.00');
        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });
        expect(inputElement.value).toBe('$0');
        expect(input.getFormattedValue()).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        input.enableStrictMode();
        input.setValue('123.00');
        expect(inputElement.value).toBe('$123.00');
        expect(input.getFormattedValue()).toBe('$123.00');
        expect(input.getValue()).toBe('123.00');
        await userEvent.type(inputElement,    '{backspace}{backspace}', {
            initialSelectionStart: 4,
            initialSelectionEnd: 4,
        });
        expect(inputElement.value).toBe('$1.00');
        expect(input.getFormattedValue()).toBe('$1.00');
        expect(input.getValue()).toBe('1.00');
        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });
        expect(inputElement.value).toBe('$0.00');
        expect(input.getFormattedValue()).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

    });

    it('should discard incorrect inputs',  async () => {
        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        await userEvent.type(inputElement,    'a', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');

        await userEvent.type(inputElement,    '1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');

        await userEvent.type(inputElement,    '.', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');

        await userEvent.type(inputElement,    '0', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');

    });



    it('should keep the caret at the expected position after inserting/deleting characters',  async () => {
        expect(inputElement.value).toBe('$0.00');

        await userEvent.type(inputElement,    '9', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.selectionStart).toBe(2);
        expect(inputElement.selectionEnd).toBe(2);
        expect(inputElement.value).toBe('$90.00');

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 4,
            initialSelectionEnd: 4,
        });

        expect(inputElement.value).toBe('$9,000');
        expect(inputElement.selectionStart).toBe(4);
        expect(inputElement.selectionEnd).toBe(4);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });

        expect(inputElement.value).toBe('$9,000');
        expect(inputElement.selectionStart).toBe(3);
        expect(inputElement.selectionEnd).toBe(3);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });

        expect(inputElement.value).toBe('$9,000');
        expect(inputElement.selectionStart).toBe(1);
        expect(inputElement.selectionEnd).toBe(1);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$9,000');
        expect(inputElement.selectionStart).toBe(2);
        expect(inputElement.selectionEnd).toBe(2);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 4,
            initialSelectionEnd: 4,
        });

        expect(inputElement.value).toBe('$900');
        expect(inputElement.selectionStart).toBe(2);
        expect(inputElement.selectionEnd).toBe(2);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 0,
            initialSelectionEnd: 4,
        });


        input.add('1800.00');
        expect(inputElement.value).toBe('$2,700.00');
        await userEvent.type(inputElement, '{delete}', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1
        });
        expect(inputElement.value).toBe('$700.00');
        expect(inputElement.selectionStart).toBe(1);
        expect(inputElement.selectionEnd).toBe(1);


        await userEvent.type(inputElement,'{delete}', {
            initialSelectionStart: 0,
            initialSelectionEnd: 0
        });

        expect(inputElement.value).toBe('$700.00');
        expect(inputElement.selectionStart).toBe(0);
        expect(inputElement.selectionEnd).toBe(0);

        input.format({
            currencySymbol: ''
        });
        input.setValue('750.00');
        expect(inputElement.value).toBe('750.00');

        await userEvent.type(inputElement,'{delete}', {
            initialSelectionStart: 0,
            initialSelectionEnd: 0
        });

        expect(inputElement.value).toBe('50.00');
        expect(inputElement.selectionStart).toBe(0);
        expect(inputElement.selectionEnd).toBe(0);

    });

    it('should handle currencies without decimal places',  async () => {
        input.setValue('0');
        expect(inputElement.value).toBe('$0');
        expect(input.getValue()).toBe('0');
        expect(input.getFormattedValue()).toBe('$0');

        await userEvent.type(inputElement,    '0', {
            initialSelectionStart: 0,
            initialSelectionEnd: 0,
        });
        expect(inputElement.value).toBe('$0');
        expect(input.getValue()).toBe('0');
        expect(input.getFormattedValue()).toBe('$0');

        await userEvent.type(inputElement,    '7', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(inputElement.value).toBe('$70');
        expect(input.getValue()).toBe('70');
        expect(input.getFormattedValue()).toBe('$70');

        await userEvent.type(inputElement,    '123456', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(inputElement.value).toBe('$12,345,670');
        expect(input.getValue()).toBe('12345670');
        expect(input.getFormattedValue()).toBe('$12,345,670');

    });

    it('can also format values without group separators and keep the caret at the right position',
        async () => {
        input.format({
           groupSeparator: ''
        });
        expect(inputElement.value).toBe('$0.00');

        await userEvent.type(inputElement,    '123456789', {
            initialSelectionStart: 1,
            initialSelectionEnd: 2,
        });
        expect(inputElement.value).toBe('$123456789.00');
        expect(input.getValue()).toBe('123456789.00');
        expect(input.getFormattedValue()).toBe('$123456789.00');
        expect(inputElement.selectionStart).toBe(10);
        expect(inputElement.selectionEnd).toBe(10);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 3,
            initialSelectionEnd: 6,
        });
        expect(input.getFormattedValue()).toBe('$126789.00');
        expect(inputElement.selectionStart).toBe(3);
        expect(inputElement.selectionEnd).toBe(3);

        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });
        expect(input.getFormattedValue()).toBe('$16789.00');
        expect(inputElement.selectionStart).toBe(2);
        expect(inputElement.selectionEnd).toBe(2);


        await userEvent.type(inputElement,    '1', {
            initialSelectionStart: 3,
            initialSelectionEnd: 3,
        });
        expect(input.getFormattedValue()).toBe('$161789.00');
        expect(inputElement.selectionStart).toBe(4);
        expect(inputElement.selectionEnd).toBe(4);


    });

    it('should not accept any input when disabled', async () => {
        expect(input.isDisabled()).toBeFalsy();
        expect(inputElement.disabled).toBeFalsy();
        input.disable();
        expect(input.isDisabled()).toBeTruthy();
        expect(inputElement.disabled).toBeTruthy();
        expect(()=>{input.disable()}).not.toThrow();
        await userEvent.type(inputElement,'1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getFormattedValue()).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(inputElement.value).toBe('$0.00');

        input.enable();
        expect(()=>{input.enable()}).not.toThrow();
        expect(input.isDisabled()).toBeFalsy();
        expect(inputElement.disabled).toBeFalsy();
        await userEvent.type(inputElement,'1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getFormattedValue()).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');
        expect(inputElement.value).toBe('$10.00');

    });

    describe('remount', () => {
        it('should detach the input from the old element and attach it to a new one', async () => {
            const otherInputElement = document.querySelector('#inputElementTwo') as HTMLInputElement;
            expect(inputElement.value).toBe('$0.00');
            expect(otherInputElement.value).toBe('');

            input.remount(otherInputElement);
            expect(inputElement.value).toBe('$0.00');
            expect(otherInputElement.value).toBe('$0.00');

            await userEvent.type(inputElement,    '1', {
                initialSelectionStart: 0,
                initialSelectionEnd: 0,
            });
            expect(inputElement.value).toBe('1$0.00');

            await userEvent.type(otherInputElement,    '1', {
                initialSelectionStart: 0,
                initialSelectionEnd: 0,
            });
            expect(otherInputElement.value).toBe('$0.00');

            input.remount(otherInputElement);

            await userEvent.type(otherInputElement,    '1', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(otherInputElement.value).toBe('$10.00');

        });
    });

    describe('Arithmetic', () => {
        it('should add to the current value and refresh the input', () => {
            expect(input.getValue()).toBe('0.00');
            input.add('19.00');
            expect(input.getValue()).toBe('19.00');
            expect(input.getFormattedValue()).toBe('$19.00');
            expect(inputElement.value).toBe('$19.00');

            input.add(new Money('-2.00'));
            expect(input.getValue()).toBe('17.00');
            expect(input.getFormattedValue()).toBe('$17.00');
            expect(inputElement.value).toBe('$17.00');

            input.add('0.01');
            expect(input.getValue()).toBe('17.01');
            expect(input.getFormattedValue()).toBe('$17.01');
            expect(inputElement.value).toBe('$17.01');

            input.add('-0.02');
            expect(input.getValue()).toBe('16.99');
            expect(input.getFormattedValue()).toBe('$16.99');
            expect(inputElement.value).toBe('$16.99');
        });

        it('should subtract from the current value and refresh the input', () => {
            expect(input.getValue()).toBe('0.00');
            input.subtract('19.00');
            expect(input.getValue()).toBe('-19.00');
            expect(input.getFormattedValue()).toBe('-$19.00');
            expect(inputElement.value).toBe('-$19.00');

            input.subtract(new Money('-2.00'));
            expect(input.getValue()).toBe('-17.00');
            expect(input.getFormattedValue()).toBe('-$17.00');
            expect(inputElement.value).toBe('-$17.00');

            input.subtract('0.01');
            expect(input.getValue()).toBe('-17.01');
            expect(input.getFormattedValue()).toBe('-$17.01');
            expect(inputElement.value).toBe('-$17.01');

            input.subtract('-0.02');
            expect(input.getValue()).toBe('-16.99');
            expect(input.getFormattedValue()).toBe('-$16.99');
            expect(inputElement.value).toBe('-$16.99');
        });
    });

    describe('Callbacks', () => {
        it('should execute user-specified callback functions', async () => {
            let counter = 0;

            input.validCallback(() => {
                counter++;
            });

            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });

            expect(counter).toBe(1);

            input.invalidCallback(() => {
                counter += 2;
            });

            await userEvent.type(inputElement, 'a', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(counter).toBe(3);

            await userEvent.type(inputElement, '9', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(counter).toBe(4);

        });
    });

    describe('format', () => {
        it('ensures that decimal and group separator are different', () => {
            expect(() => input.format({
                groupSeparator: '',
                decimalSeparator: ''
            })).toThrow();
            expect(() => input.format({
                groupSeparator: '',
                decimalSeparator: '.'
            })).not.toThrow();
            expect(() => input.format({
                decimalSeparator: ','
            })).toThrow();
            expect(() => input.format({
                groupSeparator: '.'
            })).toThrow();
            expect(() => input.format({
                groupSeparator: '.',
                decimalSeparator: ','
            })).not.toThrow();
            expect(() => input.format({
                groupSeparator: '.',
                decimalSeparator: '.'
            })).toThrow();
            expect(() => input.format({
                groupSeparator: 'ABC',
                decimalSeparator: 'GDA'
            })).toThrow();
        });
        it('ensures that the decimal separator is not empty', () => {
            expect(() => input.format({
                decimalSeparator: '.'
            })).not.toThrow();
            expect(() => input.format({
                decimalSeparator: ''
            })).toThrow();
        });
        it('ensures that the positve and negative sign are different', () => {
            expect(() => input.format({
                positiveSign: '-'
            })).toThrow();
            expect(() => input.format({
                positiveSign: '-',
                negativeSign: '+'
            })).not.toThrow();
            expect(() => input.format({
                positiveSign: '-',
                negativeSign: '-'
            })).toThrow();
        });
        it('ignores formatting options that are unused by current library version', () => {
            const warn = jest.spyOn(console, 'warn').mockImplementation();
            input.format({
                digitCharacters: [],
                myriadMode: MyriadMode.CHINESE,
                myriadCharacters: []
            });
            expect(warn).toHaveBeenCalledTimes(3);
        });
        it('should format the value according to options', () => {
            input.setValue('76279375987579876.734');
            input.format({
                groupSeparator: '  ',
                groupSize: 4,
                currencySymbol: '€',
                currencyName: 'EUR',
                nameSeparator: '_',
                symbolSeparator: '-',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL
            });
            expect(input.getFormattedValue()).toBe('EUR_7  6279  3759  8757  9876.734-€');
            expect(inputElement.value).toBe('EUR_7  6279  3759  8757  9876.734-€');
        });
        it('should only except positve/negative signs that one character long (one can be empty)', () => {
            expect(() => {
                input.format({
                    positiveSign: '+-'
                });
            }).toThrow();
            expect(() => {
                input.format({
                    negativeSign: '+-'
                });
            }).toThrow();
            expect(() => {
                input.format({
                    positiveSign: 'xy',
                    negativeSign: 'ab'
                });
            }).toThrow();
            expect(() => {
                input.format({
                    positiveSign: '',
                    negativeSign: '-'
                });
            }).not.toThrow();
            expect(() => {
                input.format({
                    positiveSign: '+',
                    negativeSign: '-'
                });
            }).not.toThrow();
            expect(() => {
                input.format({
                    positiveSign: '+',
                    negativeSign: ''
                });
            }).not.toThrow();
            expect(() => {
                input.format({
                    positiveSign: '',
                });
            }).not.toThrow();
            expect(() => {
                input.format({
                    negativeSign: '',
                });
            }).toThrow();
        });

    });

    describe('strict mode', () => {
        beforeEach(() => {
            input.enableStrictMode();
            input.setValue('1234567.89');
            expect(input.getFormattedValue()).toBe('$1,234,567.89');
            expect(input.getValue()).toBe('1234567.89');
            expect(inputElement.value).toBe('$1,234,567.89');
        })

        it('should replace numbers behind decimal point on insert', async () => {
            await userEvent.type(inputElement, '9', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.89');
            expect(input.getValue()).toBe('91234567.89');
            expect(inputElement.value).toBe('$91,234,567.89');

            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 11,
                initialSelectionEnd: 12
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.89');
            expect(input.getValue()).toBe('91234567.89');
            expect(inputElement.value).toBe('$91,234,567.89');
            expect(inputElement.selectionStart).toBe(12);
            expect(inputElement.selectionEnd).toBe(12);

            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 12,
                initialSelectionEnd: 12
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.19');
            expect(input.getValue()).toBe('91234567.19');
            expect(inputElement.value).toBe('$91,234,567.19');
            expect(inputElement.selectionStart).toBe(13);
            expect(inputElement.selectionEnd).toBe(13);

            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 13,
                initialSelectionEnd: 13
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.11');
            expect(input.getValue()).toBe('91234567.11');
            expect(inputElement.value).toBe('$91,234,567.11');
            expect(inputElement.selectionStart).toBe(14);
            expect(inputElement.selectionEnd).toBe(14);

            input.format({
                currencyName: 'USD'
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.11 USD');
            expect(input.getValue()).toBe('91234567.11');
            expect(inputElement.value).toBe('$91,234,567.11 USD');

            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 14,
                initialSelectionEnd: 14
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.11 USD');
            expect(input.getValue()).toBe('91234567.11');
            expect(inputElement.value).toBe('$91,234,567.11 USD');
            expect(inputElement.selectionStart).toBe(14);
            expect(inputElement.selectionEnd).toBe(14);

            input.disableStrictMode();
            await userEvent.type(inputElement, '0', {
                initialSelectionStart: 12,
                initialSelectionEnd: 12
            });
            expect(input.getFormattedValue()).toBe('$91,234,567.11 USD');
            expect(input.getValue()).toBe('91234567.11');
            expect(inputElement.value).toBe('$91,234,567.11 USD');
            expect(inputElement.selectionStart).toBe(12);
            expect(inputElement.selectionEnd).toBe(12);

        });

        it('should replace numbers behind decimal point with zeroes on backspace/delete', async () => {
            await userEvent.type(inputElement, '{backspace}', {
                initialSelectionStart: 13,
                initialSelectionEnd: 13
            });
            expect(input.getFormattedValue()).toBe('$1,234,567.80');
            expect(input.getValue()).toBe('1234567.80');
            expect(inputElement.value).toBe('$1,234,567.80');
            expect(inputElement.selectionStart).toBe(12);
            expect(inputElement.selectionEnd).toBe(12);

            await userEvent.type(inputElement, '{backspace}', {
                initialSelectionStart: 12,
                initialSelectionEnd: 12
            });
            expect(input.getFormattedValue()).toBe('$1,234,567.00');
            expect(input.getValue()).toBe('1234567.00');
            expect(inputElement.value).toBe('$1,234,567.00');
            expect(inputElement.selectionStart).toBe(11);
            expect(inputElement.selectionEnd).toBe(11);

            await userEvent.type(inputElement, '{backspace}', {
                initialSelectionStart: 11,
                initialSelectionEnd: 11
            });
            expect(input.getFormattedValue()).toBe('$1,234,567.00');
            expect(input.getValue()).toBe('1234567.00');
            expect(inputElement.value).toBe('$1,234,567.00');
            expect(inputElement.selectionStart).toBe(10);
            expect(inputElement.selectionEnd).toBe(10);

            input.setValue('123.45');
            expect(input.getFormattedValue()).toBe('$123.45');
            expect(input.getValue()).toBe('123.45');
            expect(inputElement.value).toBe('$123.45');

            await userEvent.type(inputElement, '{delete}', {
                initialSelectionStart: 4,
                initialSelectionEnd: 4
            });
            expect(input.getFormattedValue()).toBe('$123.45');
            expect(input.getValue()).toBe('123.45');
            expect(inputElement.value).toBe('$123.45');
            expect(inputElement.selectionStart).toBe(4);
            expect(inputElement.selectionEnd).toBe(4);

            await userEvent.type(inputElement, '{delete}', {
                initialSelectionStart: 5,
                initialSelectionEnd: 5
            });
            expect(input.getFormattedValue()).toBe('$123.05');
            expect(input.getValue()).toBe('123.05');
            expect(inputElement.value).toBe('$123.05');
            expect(inputElement.selectionStart).toBe(6);
            expect(inputElement.selectionEnd).toBe(6);

            for (let i = 6; i <= 7; i++) {
                await userEvent.type(inputElement, '{delete}', {
                    initialSelectionStart: i,
                    initialSelectionEnd: i
                });
                expect(input.getFormattedValue()).toBe('$123.00');
                expect(input.getValue()).toBe('123.00');
                expect(inputElement.value).toBe('$123.00');
                expect(inputElement.selectionStart).toBe(7);
                expect(inputElement.selectionEnd).toBe(7);
            }

        });
    });

    describe('positive/negative value accepting inputs', () => {
        it('should allow inputting signed numbers when one of the signs is the empty string', async () => {
            input.format({
               displayOrder: DisplayOrder.SYMBOL_SIGN_NUMBER_NAME
            });

            await userEvent.type(inputElement, '-', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });

            expect(input.getFormattedValue()).toBe('$0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('$0.00');
            expect(inputElement.selectionStart).toBe(1);
            expect(inputElement.selectionEnd).toBe(1);

            input.setValue('0.01');
            await userEvent.type(inputElement, '-', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });

            expect(input.getFormattedValue()).toBe('$-0.01');
            expect(input.getValue()).toBe('-0.01');
            expect(inputElement.value).toBe('$-0.01');
            expect(inputElement.selectionStart).toBe(2);
            expect(inputElement.selectionEnd).toBe(2);

            input.setValue('1.00');
            for (let i = 2; i >= 1; i--) {
                await userEvent.type(inputElement, '-', {
                    initialSelectionStart: 1,
                    initialSelectionEnd: 1
                });

                expect(input.getFormattedValue()).toBe('$-1.00');
                expect(input.getValue()).toBe('-1.00');
                expect(inputElement.value).toBe('$-1.00');
                expect(inputElement.selectionStart).toBe(i);
                expect(inputElement.selectionEnd).toBe(i);
            }

            input.format({
                displayOrder: DisplayOrder.SYMBOL_SIGN_NUMBER_NAME,
                positiveSign: '+',
                negativeSign: ''
            });
            expect(input.getFormattedValue()).toBe('$1.00');
            expect(input.getValue()).toBe('-1.00');
            expect(inputElement.value).toBe('$1.00');

            input.add('1.00');
            expect(input.getFormattedValue()).toBe('$0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('$0.00');

            input.add('1.00');
            expect(input.getFormattedValue()).toBe('$+1.00');
            expect(input.getValue()).toBe('1.00');
            expect(inputElement.value).toBe('$+1.00');

            input.format({
                displayOrder: DisplayOrder.SYMBOL_SIGN_NUMBER_NAME,
                positiveSign: '',
                negativeSign: '-'
            });

            input.subtract('1.00');
            expect(input.getFormattedValue()).toBe('$0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('$0.00');

            input.subtract('1.00');
            expect(input.getFormattedValue()).toBe('$-1.00');
            expect(input.getValue()).toBe('-1.00');
            expect(inputElement.value).toBe('$-1.00');

        });

        it('should let you overwrite the current sign when inserting a character left of ' +
            'the current sign if both signs have length one', async () => {
            input.format({
                displayOrder: DisplayOrder.SYMBOL_SIGN_NUMBER_NAME,
                positiveSign: '+',
                negativeSign: '-'
            });
            expect(input.getFormattedValue()).toBe('$+0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('$+0.00');

            await userEvent.type(inputElement, '-', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(input.getFormattedValue()).toBe('$+0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('$+0.00');

            input.setValue('1.00');
            expect(input.getFormattedValue()).toBe('$+1.00');
            expect(input.getValue()).toBe('1.00');
            expect(inputElement.value).toBe('$+1.00');

            for (let i = 2; i >= 1; i--) {
                await userEvent.type(inputElement, '-', {
                    initialSelectionStart: 1,
                    initialSelectionEnd: 1
                });
                expect(input.getFormattedValue()).toBe('$-1.00');
                expect(input.getValue()).toBe('-1.00');
                expect(inputElement.value).toBe('$-1.00');
                expect(inputElement.selectionStart).toBe(i);
                expect(inputElement.selectionEnd).toBe(i);

            }
            await userEvent.type(inputElement, '+', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(input.getFormattedValue()).toBe('$+1.00');
            expect(input.getValue()).toBe('1.00');
            expect(inputElement.value).toBe('$+1.00');
            expect(inputElement.selectionStart).toBe(2);
            expect(inputElement.selectionEnd).toBe(2);
        });

        it('should allow entering a negative sign in front of a zero value when set to do so', async () => {
            input.allowNegativeZero(true);
            await userEvent.type(inputElement, '-', {
                initialSelectionStart: 1,
                initialSelectionEnd: 1
            });
            expect(input.getFormattedValue()).toBe('$0.00');
            expect(input.getValue()).toBe('0.00');
            expect(inputElement.value).toBe('-$0.00');
        });
    });

    describe('min/max', () => {
        it('should adjust the current value when set', async () => {
            input.setValue('-11.42');
            expect(input.getFormattedValue()).toBe('-$11.42');
            expect(input.getValue()).toBe('-11.42');
            expect(inputElement.value).toBe('-$11.42');

            input.setMin('-10.00');
            expect(input.getFormattedValue()).toBe('-$10.00');
            expect(input.getValue()).toBe('-10.00');
            expect(inputElement.value).toBe('-$10.00');

            input.setMin('-11.00');
            expect(input.getFormattedValue()).toBe('-$10.00');
            expect(input.getValue()).toBe('-10.00');
            expect(inputElement.value).toBe('-$10.00');

            input.setValue('-11.01');
            expect(input.getFormattedValue()).toBe('-$11.00');
            expect(input.getValue()).toBe('-11.00');
            expect(inputElement.value).toBe('-$11.00');

            input.setValue('12.42');
            expect(input.getFormattedValue()).toBe('$12.42');
            expect(input.getValue()).toBe('12.42');
            expect(inputElement.value).toBe('$12.42');

            input.setMax('10.00');
            expect(input.getFormattedValue()).toBe('$10.00');
            expect(input.getValue()).toBe('10.00');
            expect(inputElement.value).toBe('$10.00');

            input.setMax('11.00');
            expect(input.getFormattedValue()).toBe('$10.00');
            expect(input.getValue()).toBe('10.00');
            expect(inputElement.value).toBe('$10.00');

            input.setValue('15.00');
            expect(input.getFormattedValue()).toBe('$11.00');
            expect(input.getValue()).toBe('11.00');
            expect(inputElement.value).toBe('$11.00');

            input.setMin(null);
            input.setMax(null);

            input.setValue('200.00');
            expect(input.getFormattedValue()).toBe('$200.00');
            expect(input.getValue()).toBe('200.00');
            expect(inputElement.value).toBe('$200.00');

            input.setValue('-200.00');
            expect(input.getFormattedValue()).toBe('-$200.00');
            expect(input.getValue()).toBe('-200.00');
            expect(inputElement.value).toBe('-$200.00');

            input.setValue('-21000.00');
            await userEvent.type(inputElement, '{delete}', {
                initialSelectionStart: 5,
                initialSelectionEnd: 5
            });
            expect(input.getFormattedValue()).toBe('-$2,100.00');
            expect(input.getValue()).toBe('-2100.00');
            expect(inputElement.value).toBe('-$2,100.00');

            await userEvent.type(inputElement, '{delete}', {
                initialSelectionStart: 2,
                initialSelectionEnd: 2
            });
            expect(input.getFormattedValue()).toBe('-$100.00');
            expect(input.getValue()).toBe('-100.00');
            expect(inputElement.value).toBe('-$100.00');

            input.setMin('-100.00');
            await userEvent.type(inputElement, '1', {
                initialSelectionStart: 2,
                initialSelectionEnd: 2
            });
            expect(input.getFormattedValue()).toBe('-$100.00');
            expect(input.getValue()).toBe('-100.00');
            expect(inputElement.value).toBe('-$100.00');

        });

        it('should reject invalid values', () => {
            expect(() => {
                input.setMin('-1');
            }).toThrow();
            expect(() => {
                input.setMax('-1');
            }).toThrow();
            expect(() => {
                input.setMin('-1.00');
            }).not.toThrow();
            expect(() => {
                input.setMax('-2.00');
            }).toThrow();
            expect(() => {
                input.setMax('2.00');
            }).not.toThrow();
            expect(() => {
                input.setMin('3.00');
            }).toThrow();
        });

        it('should reset limits when a value with a new floating point precision is introduced', () => {
            input.setMin('-10.00');
            input.setMax('10.00');
            input.setValue('0.0');

            input.setValue('-20.0');
            expect(input.getFormattedValue()).toBe('-$20.0');
            expect(input.getValue()).toBe('-20.0');
            expect(inputElement.value).toBe('-$20.0');

            input.setValue('20.0');
            expect(input.getFormattedValue()).toBe('$20.0');
            expect(input.getValue()).toBe('20.0');
            expect(inputElement.value).toBe('$20.0');
        });
    });
});
