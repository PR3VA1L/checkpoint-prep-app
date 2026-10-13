import { useState } from "react";
import { Calculator } from "lucide-react";
import { calculate } from "../learning/calculator";
export default function FloatingCalculator() {
  const [open, setOpen] = useState(false),
    [value, setValue] = useState(""),
    [error, setError] = useState("");
  function evaluate() {
    try {
      setValue(String(calculate(value)));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check calculation");
    }
  }
  if (!open)
    return (
      <button
        className="calculator-toggle"
        aria-label="Open calculator"
        onClick={() => setOpen(true)}
      >
        <Calculator size={23} />
      </button>
    );
  return (
    <section className="calculator panel" aria-label="Calculator">
      <div className="section-title">
        <h2>Calculator</h2>
        <button
          className="secondary"
          aria-label="Close calculator"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      </div>
      <label htmlFor="calculation">Calculation</label>
      <input
        id="calculation"
        value={value}
        maxLength={120}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") evaluate();
          if (e.key === "Escape") setOpen(false);
        }}
      />
      {error && <p role="alert">{error}</p>}
      <div className="calculator-keys">
        {[
          "AC",
          "⌫",
          "(",
          ")",
          "7",
          "8",
          "9",
          "÷",
          "4",
          "5",
          "6",
          "×",
          "1",
          "2",
          "3",
          "−",
          "0",
          ".",
          "=",
          "+",
        ].map((k) => (
          <button
            key={k}
            className="secondary"
            aria-label={
              k === "⌫"
                ? "Delete last character"
                : k === "AC"
                  ? "Clear calculation"
                  : k
            }
            onClick={() => {
              setError("");
              if (k === "AC") setValue("");
              else if (k === "⌫") setValue(value.slice(0, -1));
              else if (k === "=") evaluate();
              else setValue((value + k).slice(0, 120));
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </section>
  );
}
