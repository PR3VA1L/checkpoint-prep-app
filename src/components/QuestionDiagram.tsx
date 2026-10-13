import { useId } from "react";
import type { Diagram } from "../learning/types";
export default function QuestionDiagram({ diagram: d }: { diagram: Diagram }) {
  const id = useId().replace(/:/g, "");
  const arrow = (
    <defs>
      <marker
        id={id}
        markerWidth="7"
        markerHeight="7"
        refX="6"
        refY="3.5"
        orient="auto"
      >
        <path d="M0,0 L7,3.5 L0,7" fill="currentColor" />
      </marker>
    </defs>
  );
  if (d.kind === "bars") {
    const max = Math.max(...d.values, 1),
      step = Math.max(1, Math.ceil(max / 25)) * 5;
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 500 270"
          role="img"
          aria-label={`Bar chart: ${d.labels.map((l, i) => `${l}: ${d.values[i]} ${d.unit}`).join("; ")}`}
        >
          <text x="18" y="16">
            {d.unit}
          </text>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <line
                x1="50"
                y1={225 - i * 36}
                x2="480"
                y2={225 - i * 36}
                stroke="#cbd5e1"
              />
              <text x="40" y={230 - i * 36} textAnchor="end">
                {i * step}
              </text>
            </g>
          ))}
          {d.values.map((v, i) => (
            <g key={i}>
              <rect
                x={75 + i * 95}
                y={225 - (v / (step * 5)) * 180}
                width="48"
                height={(v / (step * 5)) * 180}
                fill="#b9cbe0"
                stroke="currentColor"
              />
              <text
                x={99 + i * 95}
                y={219 - (v / (step * 5)) * 180}
                textAnchor="middle"
              >
                {v}
              </text>
              <text x={99 + i * 95} y="248" textAnchor="middle">
                {d.labels[i]}
              </text>
            </g>
          ))}
        </svg>
        <details>
          <summary>Chart data in a table</summary>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>{d.unit}</th>
              </tr>
            </thead>
            <tbody>
              {d.labels.map((l, i) => (
                <tr key={l}>
                  <td>{l}</td>
                  <td>{d.values[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </figure>
    );
  }
  if (d.kind === "triangle")
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 400 230"
          role="img"
          aria-label={`Right-angled triangle: perpendicular base ${d.base} cm and height ${d.height} cm.`}
        >
          <path
            d="M80 30 L80 180 L320 180 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M80 165 H95 V180" fill="none" stroke="currentColor" />
          <text x="200" y="205" textAnchor="middle">
            {d.base} cm
          </text>
          <text x="65" y="110" textAnchor="end">
            {d.height} cm
          </text>
          <text x="290" y="30">
            Not to scale
          </text>
        </svg>
      </figure>
    );
  if (d.kind === "rectangle")
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 400 220"
          role="img"
          aria-label={`Rectangle ${d.width} cm by ${d.height} cm, not drawn to scale`}
        >
          <rect
            x="80"
            y="40"
            width="230"
            height="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <text x="190" y="190" textAnchor="middle">
            {d.width} cm
          </text>
          <text x="65" y="105" textAnchor="end">
            {d.height} cm
          </text>
        </svg>
        <figcaption>Not drawn to scale</figcaption>
      </figure>
    );
  if (d.kind === "forces")
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 440 150"
          role="img"
          aria-label={`Trolley with ${d.left} newtons to the left and ${d.right} newtons to the right`}
        >
          {arrow}
          <rect
            x="165"
            y="50"
            width="110"
            height="50"
            fill="none"
            stroke="currentColor"
          />
          <circle cx="185" cy="110" r="9" />
          <circle cx="255" cy="110" r="9" />
          <line
            x1="165"
            y1="75"
            x2="35"
            y2="75"
            stroke="currentColor"
            strokeWidth="3"
            markerEnd={`url(#${id})`}
          />
          <line
            x1="275"
            y1="75"
            x2="410"
            y2="75"
            stroke="currentColor"
            strokeWidth="3"
            markerEnd={`url(#${id})`}
          />
          <text x="80" y="52">
            {d.left} N
          </text>
          <text x="330" y="52">
            {d.right} N
          </text>
        </svg>
      </figure>
    );
  if (d.kind === "foodweb") {
    const pos = [
      [50, 170],
      [160, 170],
      [285, 105],
      [400, 50],
      [280, 220],
    ];
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 470 270"
          role="img"
          aria-label={`Food web. Arrows: ${d.edges.map(({ from, to }) => `${d.nodes[from]} to ${d.nodes[to]}`).join("; ")}`}
        >
          {arrow}
          {d.edges.map(({ from: a, to: b }, i) => (
            <line
              key={i}
              x1={pos[a][0] + 18}
              y1={pos[a][1] - 8}
              x2={pos[b][0] - 20}
              y2={pos[b][1] - 8}
              stroke="currentColor"
              strokeWidth="2"
              markerEnd={`url(#${id})`}
            />
          ))}
          {d.nodes.map((n, i) => (
            <g key={n}>
              <rect
                x={pos[i][0] - 44}
                y={pos[i][1] - 20}
                width="88"
                height="30"
                rx="5"
                fill="white"
                stroke="currentColor"
              />
              <text
                x={pos[i][0]}
                y={pos[i][1]}
                textAnchor="middle"
                fontSize="12"
              >
                {n}
              </text>
            </g>
          ))}
        </svg>
        <figcaption>Arrows show the direction of energy transfer.</figcaption>
      </figure>
    );
  }
  if (d.kind === "grid") {
    const coords = d.points.map(({ x, y }) => Math.max(Math.abs(x), Math.abs(y))),
      range = Math.max(8, ...coords),
      scale = 170 / range;
    return (
      <figure className="exam-diagram">
        <svg
          viewBox="0 0 400 400"
          role="img"
          aria-label={d.points
            .map(({ x, y, label }) => `${label} at (${x}, ${y})`)
            .join("; ")}
        >
          {Array.from({ length: range * 2 + 1 }, (_, i) => i - range).map(
            (n) => (
              <g key={n}>
                <line
                  x1={200 + n * scale}
                  y1="20"
                  x2={200 + n * scale}
                  y2="380"
                  stroke={n ? "#ddd" : "#222"}
                />
                <line
                  x1="20"
                  y1={200 - n * scale}
                  x2="380"
                  y2={200 - n * scale}
                  stroke={n ? "#ddd" : "#222"}
                />
                {n % 2 === 0 && (
                  <>
                    <text x={200 + n * scale} y="215" fontSize="10">
                      {n}
                    </text>
                    <text x="184" y={200 - n * scale} fontSize="10">
                      {n}
                    </text>
                  </>
                )}
              </g>
            ),
          )}
          {d.points.map(({ x, y, label: l }) => (
            <g key={l}>
              <circle
                cx={200 + x * scale}
                cy={200 - y * scale}
                r="4"
                fill="#193c6d"
              />
              <text x={208 + x * scale} y={192 - y * scale}>
                {l}
              </text>
            </g>
          ))}
          <text x="385" y="194">
            x
          </text>
          <text x="206" y="16">
            y
          </text>
        </svg>
      </figure>
    );
  }
  const lamp = (x: number, y: number) => (
    <g>
      <circle
        cx={x}
        cy={y}
        r="15"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d={`M${x - 10} ${y - 10}l20 20m0 -20l-20 20`}
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
  );
  return (
    <figure className="exam-diagram">
      <svg
        viewBox="0 0 420 250"
        role="img"
        aria-label={`Two lamps in ${d.parallel ? "parallel" : "series"}, with main switch ${d.open ? "open" : "closed"}.`}
      >
        <path
          d="M60 180 V50 H180 M200 50 H280 M320 50 H360 V180 H60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="180"
          y1="32"
          x2="180"
          y2="68"
          stroke="currentColor"
          strokeWidth="3"
        />
        <line
          x1="200"
          y1="40"
          x2="200"
          y2="60"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="280" cy="50" r="3" />
        <circle cx="320" cy="50" r="3" />
        <path
          d={d.open ? "M280 50 L315 27" : "M280 50 H320"}
          stroke="currentColor"
          strokeWidth="2"
        />
        {d.parallel ? (
          <>
            <path d="M60 120 H360" stroke="currentColor" strokeWidth="2" />
            {lamp(210, 120)}
            {lamp(210, 180)}
          </>
        ) : (
          <>
            {lamp(145, 180)}
            {lamp(280, 180)}
          </>
        )}
      </svg>
    </figure>
  );
}
