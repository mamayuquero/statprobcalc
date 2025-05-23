// js/regression.js

let chart;

function parseInput(input) {
  return input
    .split(",")
    .map((v) => parseFloat(v.trim()))
    .filter((v) => !isNaN(v));
}

function calculateRegressionLine(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi ** 2, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function calculatePearsonR(x, y) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denominatorX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0));
  const denominatorY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0));

  return numerator / (denominatorX * denominatorY);
}

function renderChart(x, y, slope, intercept) {
  const ctx = document.getElementById("regressionChart").getContext("2d");
  if (chart) chart.destroy();

  const scatterData = x.map((xi, i) => ({ x: xi, y: y[i] }));
  const minX = Math.min(...x);
  const maxX = Math.max(...x);
  const regressionLine = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];

  chart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Data",
          data: scatterData,
          backgroundColor: "#3182ce",
        },
        {
          label: "Garis Regresi",
          data: regressionLine,
          type: "line",
          borderColor: "#e53e3e",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Scatter Plot + Regresi Linear" },
      },
      scales: {
        x: { type: "linear", position: "bottom" },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const x = parseInput(document.getElementById("dataX").value);
    const y = parseInput(document.getElementById("dataY").value);

    const resultsDiv = document.getElementById("regressionResults");

    if (x.length !== y.length || x.length < 2) {
      resultsDiv.innerHTML = `<p style="color: red;">Data X dan Y harus memiliki panjang yang sama dan minimal 2 pasangan.</p>`;
      return;
    }

    const { slope, intercept } = calculateRegressionLine(x, y);
    const r = calculatePearsonR(x, y);

    resultsDiv.innerHTML = `
      <p><strong>Persamaan Regresi:</strong> y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}x</p>
      <p><strong>Koefisien Korelasi (r):</strong> ${r.toFixed(3)}</p>
    `;

    renderChart(x, y, slope, intercept);
  });
});
