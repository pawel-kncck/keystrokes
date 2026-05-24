// Backspace deletes the character immediately *before* the cursor
// and moves the cursor back by one. At the start of the buffer it's a no-op.
export function backspace(state, event) {
  if (event.key !== 'Backspace') return state;
  if (state.cursor === 0) return state;

  const { text, cursor } = state;

  return {
    text: text.slice(0, cursor - 1) + text.slice(cursor),
    cursor: cursor - 1,
  };
}
