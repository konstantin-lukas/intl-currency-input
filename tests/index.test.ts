import userEvent from '@testing-library/user-event';
import { IntlCurrencyInput } from "../src";
import { Money } from "moneydew";

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

        expect(inputElement.value).toBe('$900');
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

    it('should not accept any input when disabled and add a disabled class for styling', async () => {
        expect(input.isDisabled()).toBeFalsy();
        input.disable();
        expect(input.isDisabled()).toBeTruthy();
        expect(()=>{input.disable()}).not.toThrow();
        await userEvent.type(inputElement,'1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getFormattedValue()).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(inputElement.value).toBe('$0.00');
        expect(inputElement.classList).toContain('ici-disabled');

        input.enable();
        expect(()=>{input.enable()}).not.toThrow();
        expect(input.isDisabled()).toBeFalsy();
        await userEvent.type(inputElement,'1', {
            initialSelectionStart: 1,
            initialSelectionEnd: 1,
        });
        expect(input.getFormattedValue()).toBe('$10.00');
        expect(input.getValue()).toBe('10.00');
        expect(inputElement.value).toBe('$10.00');
        expect(inputElement.classList).not.toContain('ici-disabled');

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


});
