/**
{
  "api": 1,
  "name": "Newline to \\n",
  "description": "Convert CRLF, LF or CR to literal \\n; not a full JSON escape.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "newline,escape,convert"
}
**/

function main(state) {
  state.text = state.text.replace(/\r\n|\r|\n/g, "\\n");
}
