/**
{
  "api": 1,
  "name": "Code Points to Characters",
  "description": "Convert decimal Unicode code points separated by whitespace or commas.",
  "author": "Joseph Ng Rong En / Seven Yu",
  "icon": "dice",
  "tags": "ascii,digi,unicode,codepoint"
}
**/

function main(state) {
  const input = state.text.trim();
  if (!/^\d+(?:(?:\s*,\s*|\s+)\d+)*$/.test(input)) {
    return state.postError("Enter decimal code points separated by whitespace or commas.");
  }
  const codes = input.split(/[\s,]+/).map(Number);
  if (codes.some(code => code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF))) {
    return state.postError("Invalid Unicode scalar value (0–1114111, excluding surrogates).");
  }
  state.text = codes.map(code => String.fromCodePoint(code)).join("");
}
