/**
{
  "api": 1,
  "name": "Get Character by Code Point",
  "description": "Show the character for a decimal Unicode code point; not a keyboard keycode.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "keycode,key,unicode,codepoint"
}
**/

function main(state) {
  const input = state.text.trim();
  const code = Number(input);
  if (!/^\d+$/.test(input) || code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) {
    return state.postError("Enter a valid decimal Unicode scalar value.");
  }
  state.postInfo("Character: " + JSON.stringify(String.fromCodePoint(code)));
}
