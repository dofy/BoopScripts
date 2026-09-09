/**
{
  "api": 1,
  "name": "Super Format JSON",
  "description": "Format JSON or a limited relaxed syntax: comments, trailing commas, single quotes and bare keys. Non-JSON values become null with a notice. Not full JSON5.",
  "author": "Seven Yu",
  "icon": "roman",
  "tags": "format,json,superjson"
}
**/

// Tokenize before rewriting: string contents must never be treated as syntax.
// No eval or Function: pasted text is data, never executable JavaScript.
function normalize(input) {
  const tokens = [];
  let i = 0;
  let converted = 0;
  while (i < input.length) {
    const char = input[i];
    if (/\s/.test(char)) { i++; continue; }
    if (input.slice(i, i + 2) === "//") {
      i += 2;
      while (i < input.length && !/[\r\n]/.test(input[i])) i++;
      continue;
    }
    if (input.slice(i, i + 2) === "/*") {
      const end = input.indexOf("*/", i + 2);
      if (end < 0) throw new Error("Unterminated comment");
      i = end + 2;
      continue;
    }
    if (char === '"' || char === "'") {
      const quote = char;
      let value = "";
      let closed = false;
      i++;
      while (i < input.length) {
        let current = input[i++];
        if (current === quote) { closed = true; break; }
        if (current.charCodeAt(0) < 32) throw new Error("Unescaped control character");
        if (current === "\\") {
          if (i >= input.length) throw new Error("Incomplete escape");
          const escape = input[i++];
          const escapes = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
          if (escape === "'" && quote === "'") current = "'";
          else if (Object.prototype.hasOwnProperty.call(escapes, escape)) current = escapes[escape];
          else if (escape === "u") {
            const hex = input.slice(i, i + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error("Invalid Unicode escape");
            current = String.fromCharCode(parseInt(hex, 16));
            i += 4;
          } else throw new Error("Unsupported string escape");
        }
        value += current;
      }
      if (!closed) throw new Error("Unterminated string");
      tokens.push({ type: "string", text: JSON.stringify(value) });
      continue;
    }
    if (/[{}\[\],:]/.test(char)) {
      tokens.push({ type: "punct", text: char }); i++; continue;
    }
    const start = i;
    while (i < input.length && !/[\s{}\[\],:'"/]/.test(input[i])) i++;
    if (i === start) throw new Error("Unexpected character");
    tokens.push({ type: "bare", text: input.slice(start, i) });
  }
  const result = tokens.map((token, index) => {
    const previous = tokens[index - 1];
    const next = tokens[index + 1];
    if (token.type === "punct" && token.text === "," && next && /^[}\]]$/.test(next.text)) {
      // Never turn invalid [,] or {,} into valid empty containers.
      if (previous && (previous.type !== "punct" || /^[}\]]$/.test(previous.text))) return "";
    }
    if (token.type !== "bare") return token.text;
    if (/^[A-Za-z_$][\w$]*$/.test(token.text) && next && next.text === ":") return JSON.stringify(token.text);
    if (/^(undefined|NaN|-?Infinity)$/.test(token.text)) { converted++; return "null"; }
    // Retain the old [word] convenience, but do not guess at arbitrary expressions.
    if (/^[A-Za-z_][\w]*$/.test(token.text) && !/^(true|false|null)$/.test(token.text) &&
        previous && previous.text === "[" && next && next.text === "]") {
      converted++;
      return JSON.stringify(token.text);
    }
    return token.text;
  }).join(" ");
  return { text: result, converted: converted };
}

function main(state) {
  const input = state.text;
  let value;
  let converted = 0;
  try {
    try {
      value = JSON.parse(input);
    } catch (strictError) {
      const normalized = normalize(input);
      value = JSON.parse(normalized.text);
      converted = normalized.converted;
    }
    state.text = JSON.stringify(value, null, 2);
    state.postInfo(converted ? "Formatted; normalized " + converted + " non-JSON value(s)." : "Formatted.");
  } catch (error) {
    // Engine parser errors may contain pasted secrets; do not echo them.
    state.postError("Invalid or unsupported JSON syntax; text left unchanged.");
  }
}
