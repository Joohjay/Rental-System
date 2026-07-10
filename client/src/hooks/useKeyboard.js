import { useEffect } from 'react';

export const useKeyboard = (keymap) => {
  useEffect(() => {
    const handler = (e) => {
      for (const { key, ctrl, shift, alt, handler: fn } of keymap) {
        const matchCtrl = ctrl ? (e.ctrlKey || e.metaKey) : true;
        const matchShift = shift !== undefined ? e.shiftKey === shift : true;
        const matchAlt = alt !== undefined ? e.altKey === alt : true;

        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          matchCtrl && matchShift && matchAlt
        ) {
          e.preventDefault();
          e.stopPropagation();
          fn(e);
          return;
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keymap]);
};
