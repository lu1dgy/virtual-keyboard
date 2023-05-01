export default class TextArea {
  constructor(cols) {
    this.cols = cols;
  }

  generate() {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('cols', this.cols);
    document.body.append(textarea);
    return textarea;
  }
}
