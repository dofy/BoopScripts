/**
{
  "api": 1,
  "name": "PEM / JWT Private Key Format",
  "description": "Wrap one PEM block or bare Base64 at 64 columns; accepts literal newline escapes. Formatting only.",
  "author": "Seven Yu",
  "icon": "dice",
  "tags": "jwt,pem,private-key,format,newline"
}
**/

function main(state) {
  const input = state.text.replace(/\\r\\n|\\n|\\r/g, "\n").trim();
  let body = input;
  let label = null;
  if (/-----BEGIN|-----END/.test(input)) {
    const match = /^-----BEGIN ([A-Z0-9]+(?: [A-Z0-9]+)*)-----([\s\S]*?)-----END ([A-Z0-9]+(?: [A-Z0-9]+)*)-----$/.exec(input);
    if (!match || match[1] !== match[3]) {
      return state.postError("Expected one PEM block with matching BEGIN and END labels.");
    }
    label = match[1];
    body = match[2];
  }
  body = body.replace(/\s/g, "");
  if (!body) return state.postError("No key content found.");
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(body)) {
    return state.postError("Expected padded Base64 content; unsupported PEM metadata or invalid body.");
  }
  const wrapped = body.match(/.{1,64}/g).join("\n");
  state.text = label ? "-----BEGIN " + label + "-----\n" + wrapped + "\n-----END " + label + "-----" : wrapped;
  state.postInfo("Formatted only; key validity was not checked.");
}
