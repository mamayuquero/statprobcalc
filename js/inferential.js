// js/inferential.js

let chart;

const zTable = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const mean = parseFloat(document.getElementById("sampleMean").value);
    const stdDev = parseFloat(document.getElementById("stdDev").value);
    const n = parseInt(document.getElementById("sampleSize").value);
    const confidence = parseInt(document.getElementById("confidenceLevel").value);

    const resultDiv = document.getElementById("inferentialResults");

    if (isNaN(mean) || isNaN(stdDev) || isNaN(n) || !zTable[confidence]) {
      resultDiv.innerHTML = `<p style="color: red;">Isi semua input dengan benar.</p>`;
      return;
    }

    const z = zTable[confidence];
    const marginOfError = z * (stdDev / Math.sqrt(n));
    const lower = mean - marginOfError;
    const upper = mean + marginOfError;

    resultDiv.innerHTML = `
      <p><strong>Z:</strong> ${z}</p>
      <p><strong>Margin of Error:</strong> ±${marginOfError.toFixed(2)}</p>
      <p><strong>Confidence Interval:</strong> (${lower.toFixed(2)}, ${upper.toFixed(2)})</p>
    `;

    renderChart(mean, lower, upper);
  });
});

function renderChart(mean, lower, upper) {
  const ctx = document.getElementById("ciChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Batas Bawah", "Mean", "Batas Atas"],
      datasets: [
        {
          label: "Confidence Interval",
          data: [lower, mean, upper],
          borderColor: "#38a169",
          backgroundColor: "rgba(56,161,105,0.2)",
          fill: true,
          tension: 0,
          pointBackgroundColor: ["#e53e3e", "#4299e1", "#e53e3e"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Visualisasi Confidence Interval",
        },
      },
      scales: {
        x: { display: true },
        y: { beginAtZero: false },
      },
    },
  });
}
