import Keyboard from './components/Keyboard/index.js';
import TextArea from './components/TextArea/index.js';
import { keyboardLayout } from './utils/constants.js';

const textarea = new TextArea(50).generate();
const keyboard = new Keyboard(keyboardLayout, textarea);
keyboard.render(document.body);
