// js/probability.js

let chart;

document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("distributionType");
  const inputContainer = document.getElementById("distributionInputs");
  const resultDiv = document.getElementById("probResults");
  const button = document.getElementById("calculateBtn");

  typeSelect.addEventListener("change", updateInputs);
  button.addEventListener("click", handleCalculate);

  function updateInputs() {
    const type = typeSelect.value;
    let html = "";

    switch (type) {
      case "binomial":
        html = `
        <label>n (jumlah percobaan):</label>
        <input type="number" id="n" placeholder="Contoh: 10" />
        <label>p (probabilitas sukses):</label>
        <input type="number" id="p" placeholder="Contoh: 0.5" step="0.01" />
      `;
        break;

      case "poisson":
        html = `
        <label>λ (rata-rata kejadian):</label>
        <input type="number" id="lambda" placeholder="Contoh: 3.5" step="0.1" />
        <label>Nilai maksimum k:</label>
        <input type="number" id="maxK" placeholder="Contoh: 10" />
      `;
        break;

      case "normal":
        html = `
        <label>μ (mean):</label>
        <input type="number" id="mu" placeholder="Contoh: 0" />
        <label>σ (standar deviasi):</label>
        <input type="number" id="sigma" placeholder="Contoh: 1" step="0.1" />
      `;
        break;

      case "exponential":
        html = `
        <label>λ (laju):</label>
        <input type="number" id="lambda" placeholder="Contoh: 1.2" step="0.1" />
      `;
        break;
    }

    inputContainer.innerHTML = html;
    resultDiv.innerHTML = "Belum ada hasil.";
    if (chart) chart.destroy();
  }

  function handleCalculate() {
    const type = typeSelect.value;

    switch (type) {
      case "binomial": {
        const n = parseInt(document.getElementById("n").value);
        const p = parseFloat(document.getElementById("p").value);
        if (isNaN(n) || isNaN(p)) return;

        const labels = Array.from({ length: n + 1 }, (_, k) => k);
        const values = labels.map((k) => binomialPMF(n, k, p));
        renderChart(labels, values, `Distribusi Binomial (n=${n}, p=${p})`, "bar");
        resultDiv.innerHTML = "P(X = k) ditampilkan pada grafik.";
        break;
      }

      case "poisson": {
        const lambda = parseFloat(document.getElementById("lambda").value);
        const maxK = parseInt(document.getElementById("maxK").value);
        if (isNaN(lambda) || isNaN(maxK)) return;

        const labels = Array.from({ length: maxK + 1 }, (_, k) => k);
        const values = labels.map((k) => poissonPMF(lambda, k));
        renderChart(labels, values, `Distribusi Poisson (λ=${lambda})`, "bar");
        resultDiv.innerHTML = "P(X = k) ditampilkan pada grafik.";
        break;
      }

      case "normal": {
        const mu = parseFloat(document.getElementById("mu").value);
        const sigma = parseFloat(document.getElementById("sigma").value);
        if (isNaN(mu) || isNaN(sigma)) return;

        const labels = [];
        const values = [];
        const start = mu - 4 * sigma;
        const end = mu + 4 * sigma;
        const step = (end - start) / 100;

        for (let x = start; x <= end; x += step) {
          labels.push(x.toFixed(2));
          values.push(normalPDF(x, mu, sigma));
        }

        renderChart(labels, values, `Distribusi Normal (μ=${mu}, σ=${sigma})`, "line");
        resultDiv.innerHTML = "f(x) ditampilkan pada grafik.";
        break;
      }

      case "exponential": {
        const lambda = parseFloat(document.getElementById("lambda").value);
        if (isNaN(lambda)) return;

        const labels = [];
        const values = [];
        const step = 0.2;
        for (let x = 0; x <= 10; x += step) {
          labels.push(x.toFixed(1));
          values.push(expPDF(x, lambda));
        }

        renderChart(labels, values, `Distribusi Eksponensial (λ=${lambda})`, "line");
        resultDiv.innerHTML = "f(x) ditampilkan pada grafik.";
        break;
      }
    }
  }

  function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
  }

  function binomialPMF(n, k, p) {
    return (factorial(n) / (factorial(k) * factorial(n - k))) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  function poissonPMF(lambda, k) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  }

  function normalPDF(x, mu, sigma) {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expo = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expo;
  }

  function expPDF(x, lambda) {
    return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
  }

  function renderChart(labels, values, title, type) {
    const ctx = document.getElementById("probChart").getContext("2d");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: type === "bar" ? "P(X=k)" : "f(x)",
            data: values,
            backgroundColor: type === "bar" ? "#4299e1" : "rgba(66,153,225,0.2)",
            borderColor: "#3182ce",
            borderWidth: 2,
            fill: type === "line",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 15,
              autoSkip: true,
            },
          },
        },
      },
    });
  }

  updateInputs(); // initial call
});
