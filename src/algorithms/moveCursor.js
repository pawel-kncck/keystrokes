// Cursor movement. The cursor lives *between* characters, so its
// valid positions are [0, text.length] — that's why we clamp with min/max.
export function moveCursor(state, event) {
  const { text, cursor } = state;

  switch (event.key) {
    case 'ArrowLeft':
      return { text, cursor: Math.max(0, cursor - 1) };
    case 'ArrowRight':
      return { text, cursor: Math.min(text.length, cursor + 1) };
    case 'Home':
      return { text, cursor: 0 };
    case 'End':
      return { text, cursor: text.length };
    default:
      return state;
  }
}
