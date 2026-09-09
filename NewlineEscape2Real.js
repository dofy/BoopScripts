/**
{
  "api": 1,
  "name": "\\n to Newline",
  "description": "Convert literal \\r\\n, \\n or \\r to LF; not a full JSON unescape.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "newline,escape,convert"
}
**/

function main(state) {
  state.text = state.text.replace(/\\r\\n|\\n|\\r/g, "\n");
}
