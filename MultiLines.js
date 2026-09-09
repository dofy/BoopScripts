/**
{
  "api": 1,
  "name": "Collapse Escaped Newlines and Trim Indentation",
  "description": "Lossy: collapse literal newline escapes and remove following whitespace, including indentation.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "multilines,newline,collapse,trim,indent"
}
**/

function main(state) {
  state.text = state.text.replace(/(?:(?:\\r\\n|\\n|\\r)\s*)+/g, "\n");
}
