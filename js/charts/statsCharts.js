// js/charts/statsCharts.js

export function renderStatsCharts(data) {
  renderBarChart(data);
  renderLineChart(data);
  renderPieChart(data);
}

function renderBarChart(data) {
  const svg = d3.select("#barChart");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 10, right: 10, bottom: 30, left: 40 };

  const x = d3
    .scaleBand()
    .domain(data.map((d, i) => i))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", (d) => y(d))
    .attr("height", (d) => y(0) - y(d))
    .attr("width", x.bandwidth())
    .attr("fill", "#3182ce");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat((d) => d + 1));

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
}

function renderLineChart(data) {
  const svg = d3.select("#lineChart");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 20, right: 30, bottom: 30, left: 50 };

  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((_, i) => x(i))
    .y((d) => y(d));

  svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#38a169").attr("stroke-width", 2).attr("d", line);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(data.length)
        .tickFormat((d) => d + 1)
    );

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
}

function renderPieChart(data) {
  const svg = d3.select("#pieChart");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const radius = Math.min(width, height) / 2;

  const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie();
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  g.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));
}
