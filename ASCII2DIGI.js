/**
{
  "api": 1,
  "name": "Characters to Code Points",
  "description": "Show characters and decimal Unicode code points; preserve spaces.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "ascii,digi,unicode,codepoint"
}
**/

function main(state) {
  const chars = Array.from(state.text);
  if (!chars.length) return state.postError("Enter at least one character.");
  const codes = chars.map(char => char.codePointAt(0));
  if (codes.some(code => code >= 0xD800 && code <= 0xDFFF)) {
    return state.postError("Input contains an unpaired UTF-16 surrogate.");
  }
  // Escape control characters so each entry stays in its own table cell.
  state.text = chars.map(char => JSON.stringify(char).slice(1, -1)).join("\t") +
    "\n" + codes.join("\t");
}
