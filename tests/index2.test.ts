import userEvent from '@testing-library/user-event';
import IntlCurrencyInput from "../src";

describe('Input features', () => {

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

    it('should replace a single 0 before the comma with non zero values', async () => {
        expect(inputElement.value).toBe('$0.00');

        await userEvent.type(inputElement,    '2', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$2.00');
        expect(input.getValue()).toBe('2.00');
        expect(input.getFormattedValue()).toBe('$2.00');

        input.setValue('0.00');

        await userEvent.type(inputElement,    '0', {
            initialSelectionStart: 2,
            initialSelectionEnd: 2,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(input.getFormattedValue()).toBe('$0.00');

    });

    it('should set the value to 0 if the user deletes everything', async () => {
        input.setValue('231.25');
        expect(inputElement.value).toBe('$231.25');
        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 0,
            initialSelectionEnd: 7,
        });

        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(input.getFormattedValue()).toBe('$0.00');

        input.setValue('-232.41');
        expect(inputElement.value).toBe('-$232.41');
        await userEvent.type(inputElement,    '{backspace}', {
            initialSelectionStart: 0,
            initialSelectionEnd: 8,
        });
        expect(inputElement.value).toBe('$0.00');
        expect(input.getValue()).toBe('0.00');
        expect(input.getFormattedValue()).toBe('$0.00');
    });
});
