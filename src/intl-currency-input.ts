export class IntlCurrencyInput {
    private _container: HTMLElement;
    private _parent: HTMLElement;
    private _symbol: HTMLElement;
    private _symbolSeparator: HTMLElement;
    private _number: HTMLElement;
    private _name: HTMLElement;
    private _nameSeparator: HTMLElement;

    constructor(containerElement : HTMLElement) {
        this._container = containerElement;
        this._parent = document.createElement('div');

        this._symbol = document.createElement('span');
        this._symbol.classList.add('ici-symbol');
        this._symbol.innerText = '$';

        this._symbolSeparator = document.createElement('span');
        this._symbolSeparator.classList.add('ici-symbol-separator');
        this._symbolSeparator.innerText = ' ';

        const cancelEvent = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleInput = (e: Event) => {
            if (e instanceof KeyboardEvent && e.type === 'keydown') {
                // MOUSE CARET LEFT OR RIGHT WITH ARROW KEYS
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    const selection = window.getSelection();
                    const range = selection?.getRangeAt(0);
                    if (typeof range !== 'undefined' && selection !== null) {
                        const direction = e.key === 'ArrowLeft' ? - 1 : 1;
                        let position = range.startOffset + direction;
                        const maxLength = range.endContainer.textContent?.length;
                        if (position < 1) position = 0;
                        if (typeof maxLength !== 'undefined') {
                            if (position > maxLength)
                            position = maxLength;
                        } else {
                            position -= direction;
                        }
                        if (e.ctrlKey && e.key === 'ArrowLeft')
                            position = 0;
                        else if (e.ctrlKey)
                            position = typeof maxLength !== 'undefined' ? maxLength : range.startOffset;
                        range.setStart(range.startContainer, position);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }


                }
            }
        };

        this._number = document.createElement('span');
        this._number.classList.add('ici-number');
        this._number.innerText = '0.0';
        this._number.contentEditable = 'true';
        this._number.style.outline = 'none';

        this._number.addEventListener('input', cancelEvent);
        this._number.addEventListener('cut', cancelEvent);
        this._number.addEventListener('paste', cancelEvent);
        this._number.addEventListener('compositionend', cancelEvent);
        this._number.addEventListener('drop', cancelEvent);
        this._number.addEventListener('keydown', cancelEvent);
        this._number.addEventListener('keydown', handleInput);

        this._name = document.createElement('span');
        this._name.classList.add('ici-symbol');
        this._name.innerText = 'USD';

        this._nameSeparator = document.createElement('span');
        this._nameSeparator.classList.add('ici-symbol');
        this._nameSeparator.innerText = ' ';

        this._parent.appendChild(this._symbol);
        this._parent.appendChild(this._symbolSeparator);
        this._parent.appendChild(this._number);
        this._parent.appendChild(this._nameSeparator);
        this._parent.appendChild(this._name);
        this._container.appendChild(this._parent);
    }


}
