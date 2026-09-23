// Suppress known upstream react-native-web internal deprecation warnings
if (typeof console !== 'undefined') {
  const ignorePatterns = [
    'pointerEvents is deprecated',
    'shadow* style props are deprecated',
    'SafeAreaView has been deprecated',
  ];

  const filterConsole = (origFn) => (...args) => {
    const text = args
      .map((a) => (typeof a === 'string' ? a : (a && a.message) || ''))
      .join(' ');
    if (ignorePatterns.some((p) => text.includes(p))) {
      return;
    }
    origFn.apply(console, args);
  };

  console.warn = filterConsole(console.warn);
  console.error = filterConsole(console.error);
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

