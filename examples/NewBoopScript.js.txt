/**
{
  "api": 1,
  "name": "Boop Script Template",
  "description": "Insert a selection-aware script template at the cursor, replacing only selected text.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "boop,script,new,template"
}
**/

function main(state) {
  state.insert(template);
}

const template = `/**
{
  "api": 1,
  "name": "My Text Transform",
  "description": "Describe the text transformation.",
  "author": "Your Name",
  "icon": "dice",
  "tags": "text,transform"
}
**/

function main(state) {
  try {
    // text targets the selection, or the whole document when nothing is selected.
    const input = state.text;
    const output = input; // TODO: transform input; validate before assigning.
    state.text = output;
    state.postInfo("Done.");
  } catch (error) {
    // Do not echo potentially sensitive input in messages.
    state.postError("Transformation failed.");
  }
}
`;
