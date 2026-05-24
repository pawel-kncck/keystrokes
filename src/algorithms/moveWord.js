// Word-wise cursor movement. A "word" here is a run of \w characters;
// punctuation and whitespace are boundaries. Triggered by Alt/Option + Arrow.
const WORD = /\w/;

function nextWordBoundary(text, from, dir) {
  let i = from;
  // skip current run of non-word chars
  while (i >= 0 && i < text.length && !WORD.test(text[dir < 0 ? i - 1 : i])) {
    i += dir;
  }
  // skip the run of word chars
  while (i >= 0 && i < text.length && WORD.test(text[dir < 0 ? i - 1 : i])) {
    i += dir;
  }
  return i;
}

export function moveWord(state, event) {
  if (!event.altKey) return state;
  const { text, cursor } = state;

  if (event.key === 'ArrowLeft') {
    return { text, cursor: nextWordBoundary(text, cursor, -1) };
  }
  if (event.key === 'ArrowRight') {
    return { text, cursor: nextWordBoundary(text, cursor, +1) };
  }
  return state;
}
