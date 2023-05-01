// eslint-disable-next-line import/extensions
import { laguages, keys } from '../../utils/constants.js';

export default class Keyboard {
  constructor(layout, textarea) {
    this._layout = layout;
    this._textarea = textarea;
    this._textarea.value = '';
    this._caps = false;
    this._shift = false;
    this.keyboardElements = {};
    this._langs = laguages;
    this._currentLang = 0;
  }

  _createKeyTemplate(keyData) {
    const el = document.createElement('button');
    const [keyCode] = keyData;
    el.classList.add('key');
    el.setAttribute('data-code', keyCode);
    this.keyboardElements[keyCode] = el;
  }

  _refresh() {
    const isUpperCase = (this._shift && !this._caps) || (this._caps && !this._shift);
    const lang = this._langs[this._currentLang];
    Object.entries(this.keyboardElements).forEach(([code, el]) => {
      const functionalKey = keys.functional[code];
      if (functionalKey) {
        el.textContent = functionalKey;
      } else {
        const { main, shift } = keys.symbols[lang][code];
        let symbol;
        if (shift.toLowerCase() === main) {
          symbol = isUpperCase ? shift : main;
          el.textContent = symbol;
          el.setAttribute('data-symbol', symbol);
        } else {
          symbol = this._shift ? shift : main;
          el.innerHTML = `
            <span class=${this._shift ? 'key__shifted' : ''}>${main}</span>
            <span class=${this._shift ? '' : 'key__shifted'}>${shift}</span>`;
        }
        el.setAttribute('data-symbol', symbol);
      }
    });
  }

  onKeyClick(e) {
    const el = this.keyboardElements[e.code];
    this._textarea.focus();

    if (!el) return;

    if (e.code === 'CapsLock') {
      if (e.type === 'keyup') {
        this._caps = !this._caps;
        this._refresh();
        this.keyboardElements.CapsLock.classList.toggle('key_active');
      }
      return;
    }
    if (e.code.match(/shift/i)) {
      const newShiftState = e.type === 'keydown';
      if (this._shift !== newShiftState) {
        this._shift = newShiftState;
        this._refresh();
      }
    }
    if (e.altKey && e.shiftKey) {
      this._currentLang = this._currentLang + 1 < this._langs.length ? this._currentLang + 1 : 0;
      this._refresh();
    }
    if (e.type === 'keydown') {
      el.classList.add('key_active');
    } else {
      el.classList.remove('key_active');
    }
  }

  handleMouseDown(e) {
    const key = e.target.closest('.key');

    if (key) {
      this._textarea.focus();
      const { code, symbol } = key.dataset;
      if (symbol) {
        this._textarea.value += symbol;
      } else {
        const { value } = this._textarea;
        if (code === 'Backspace' && value.length > 0) {
          this._textarea.value = value.slice(0, -1);
        } else if (code === 'Tab') {
          this._textarea.value += ' ';
        } else if (code === 'Enter') {
          this._textarea.value += '\n';
        } else if (code === 'Space') {
          this._textarea.value += ' ';
        } else {
          const { selectionStart } = this._textarea;
          if (code === 'ArrowLeft' && selectionStart > 0) {
            this._textarea.selectionStart = selectionStart - 1;
            if (!e.shiftKey) {
              this._textarea.selectionEnd = selectionStart - 1;
            }
          }
          if (code === 'ArrowRight' && selectionStart < value.length) {
            this._textarea.selectionEnd = selectionStart + 1;
            this._textarea.selectionStart = selectionStart + 1;
          }
          if (code === 'ArrowUp' && selectionStart > 0) {
            let position = selectionStart - this._textarea.cols;
            if (position < 0) {
              position = 0;
            }
            this._textarea.selectionEnd = position;
            this._textarea.selectionStart = position;
          }
          if (code === 'ArrowDown' && selectionStart < value.length) {
            let position = selectionStart + this._textarea.cols;
            if (position > value.length) {
              position = value.length;
            }
            this._textarea.selectionEnd = position;
            this._textarea.selectionStart = position;
          }
        }
      }
    }
  }

  _listeners() {
    window.addEventListener('keydown', (e) => this.onKeyClick(e));
    window.addEventListener('keyup', (e) => this.onKeyClick(e));
    this._element.addEventListener('click', (e) => this.handleMouseDown(e));
  }

  _init() {
    const element = document.createElement('ul');
    element.classList.add('keyboard');
    this._layout.forEach((keyData) => this._createKeyTemplate(keyData));
    element.append(...Object.values(this.keyboardElements));
    this._refresh();
    this._element = element;
  }

  render(el) {
    this._init();
    el.append(this._element);
    this._listeners();
  }
}
