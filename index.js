// eslint-disable-next-line import/extensions
import Keyboard from './components/Keyboard/index.js';
// eslint-disable-next-line import/extensions
import TextArea from './components/TextArea/index.js';
// eslint-disable-next-line import/extensions
import { keyboardLayout } from './utils/constants.js';

const textarea = new TextArea(50).generate();
const keyboard = new Keyboard(keyboardLayout, textarea);
keyboard.render(document.body);
