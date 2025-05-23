// js/stats.js

function parseInput(input) {
  return input
    .split(",")
    .map((val) => parseFloat(val.trim()))
    .filter((val) => !isNaN(val));
}

function mean(data) {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

function median(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function mode(data) {
  const freq = {};
  data.forEach((val) => (freq[val] = (freq[val] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq)
    .filter((key) => freq[key] === maxFreq)
    .map(Number);
  return modes.length === data.length ? "Tidak ada" : modes.join(", ");
}

function variance(data) {
  const avg = mean(data);
  return mean(data.map((val) => (val - avg) ** 2));
}

function standardDeviation(data) {
  return Math.sqrt(variance(data));
}

function destroyIfExists(chartRef) {
  if (chartRef && typeof chartRef.destroy === "function") {
    chartRef.destroy();
  }
}

let barChart, lineChart, pieChart;

function renderCharts(data) {
  const labels = data.map((_, i) => `Data ${i + 1}`);

  destroyIfExists(barChart);
  destroyIfExists(lineChart);
  destroyIfExists(pieChart);

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Nilai",
          data,
          backgroundColor: "#3182ce",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Nilai",
          data,
          borderColor: "#38a169",
          backgroundColor: "rgba(56,161,105,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#3182ce", "#2b6cb0", "#63b3ed", "#4299e1", "#90cdf4", "#bee3f8"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function calculateStats() {
  const input = document.getElementById("dataInput").value;
  const resultsDiv = document.getElementById("results");
  const data = parseInput(input);

  if (data.length < 2) {
    resultsDiv.innerHTML = `<p style="color: #e53e3e;">Masukkan minimal 2 angka valid.</p>`;
    return;
  }

  resultsDiv.innerHTML = `
    <p><strong>Mean:</strong> ${mean(data).toFixed(2)}</p>
    <p><strong>Median:</strong> ${median(data)}</p>
    <p><strong>Mode:</strong> ${mode(data)}</p>
    <p><strong>Variance:</strong> ${variance(data).toFixed(2)}</p>
    <p><strong>Standard Deviation:</strong> ${standardDeviation(data).toFixed(2)}</p>
  `;

  renderCharts(data);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calcButton").addEventListener("click", calculateStats);
});
