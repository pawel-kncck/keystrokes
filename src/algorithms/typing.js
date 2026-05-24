// A complete "typing" reducer: combines insert, backspace, delete,
// and cursor movement into one event handler — the minimum you need
// to feel like you're typing in a real editor.
export function typing(state, event) {
  const { text, cursor } = state;

  // arrow movement (clamped to buffer bounds)
  if (event.key === 'ArrowLeft') {
    return { text, cursor: Math.max(0, cursor - 1) };
  }
  if (event.key === 'ArrowRight') {
    return { text, cursor: Math.min(text.length, cursor + 1) };
  }
  if (event.key === 'Home') return { text, cursor: 0 };
  if (event.key === 'End') return { text, cursor: text.length };

  // backspace — delete char before cursor
  if (event.key === 'Backspace') {
    if (cursor === 0) return state;
    return {
      text: text.slice(0, cursor - 1) + text.slice(cursor),
      cursor: cursor - 1,
    };
  }

  // delete — char after cursor
  if (event.key === 'Delete') {
    if (cursor >= text.length) return state;
    return {
      text: text.slice(0, cursor) + text.slice(cursor + 1),
      cursor,
    };
  }

  // printable character — insert at cursor
  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
    return {
      text: text.slice(0, cursor) + event.key + text.slice(cursor),
      cursor: cursor + 1,
    };
  }

  return state;
}
