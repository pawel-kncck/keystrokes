// Insert a single printable character at the cursor position.
// Anything that isn't a single visible glyph is ignored.
export function insertChar(state, event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return state;
  if (event.key.length !== 1) return state;

  const { text, cursor } = state;

  return {
    text: text.slice(0, cursor) + event.key + text.slice(cursor),
    cursor: cursor + 1,
  };
}
