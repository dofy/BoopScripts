/**
{
  "api": 1,
  "name": "RGB to Hex",
  "description": "Convert three integers (0–255), optionally wrapped in rgb(...), to hex.",
  "author": "luisfontes19 / Seven Yu",
  "icon": "dice",
  "tags": "rgb,hex,convert,color"
}
**/

function main(state) {
  let input = state.text.trim();
  const wrapped = /^rgb\(\s*([\s\S]*?)\s*\)$/i.exec(input);
  if (wrapped) input = wrapped[1];
  const parts = input.includes(",") ? input.split(",").map(part => part.trim()) : input.split(/\s+/);
  if (parts.length !== 3 || parts.some(part => !/^\d+$/.test(part) || Number(part) > 255)) {
    return state.postError("Expected three integers from 0 to 255, e.g. rgb(255, 128, 0).");
  }
  state.text = "#" + parts.map(part => Number(part).toString(16).padStart(2, "0")).join("").toUpperCase();
}
