// Small arithmetic parser: precedence, parentheses and unary signs, without eval.
export function calculate(input: string): number {
  const source = input
    .replace(/\s/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");
  if (!source || source.length > 120 || /[^0-9.+*/()-]/.test(source))
    throw new Error("Invalid calculation");
  let at = 0;
  function atom(): number {
    if (source[at] === "+") {
      at++;
      return atom();
    }
    if (source[at] === "-") {
      at++;
      return -atom();
    }
    if (source[at] === "(") {
      at++;
      const n = expression();
      if (source[at++] !== ")") throw new Error("Close the bracket");
      return n;
    }
    const match = source.slice(at).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (!match) throw new Error("Enter a number");
    at += match[0].length;
    return Number(match[0]);
  }
  function product(): number {
    let value = atom();
    while (source[at] === "*" || source[at] === "/") {
      const op = source[at++],
        n = atom();
      if (op === "/" && n === 0) throw new Error("Cannot divide by zero");
      value = op === "*" ? value * n : value / n;
    }
    return value;
  }
  function expression(): number {
    let value = product();
    while (source[at] === "+" || source[at] === "-") {
      const op = source[at++],
        n = product();
      value = op === "+" ? value + n : value - n;
    }
    return value;
  }
  const answer = expression();
  if (at !== source.length || !Number.isFinite(answer))
    throw new Error("Check your calculation");
  return Number(answer.toPrecision(12));
}
