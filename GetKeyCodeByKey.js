/**
{
  "api": 1,
  "name": "Get Code Point by Character",
  "description": "Show the Unicode code point of exactly one character; not a keyboard keycode.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "keycode,key,unicode,codepoint"
}
**/

function main(state) {
  const chars = Array.from(state.text);
  if (chars.length !== 1) return state.postError("Enter exactly one Unicode character.");
  const code = chars[0].codePointAt(0);
  if (code >= 0xD800 && code <= 0xDFFF) return state.postError("Unpaired UTF-16 surrogate.");
  state.postInfo("Code point: " + code + " (U+" + code.toString(16).toUpperCase().padStart(4, "0") + ")");
}
