// ---- Binomial PDF ---- //

class BinomialPdf {
  constructor(elm) {
    this.pSlider = elm.querySelector('.BinomialPdf-p');
    this.nInput = elm.querySelector('.BinomialPdf-n');
    this.graph = elm.querySelector('.BinomialPdf-graph');
    this.pVal = elm.querySelector('.BinomialPdf-pVal');

    this.render();

    this.pSlider.addEventListener('change', () => this.render());
    this.pSlider.addEventListener('input', () => this.render());
    this.nInput.addEventListener('change', () => this.render(true));
    this.nInput.addEventListener('input', () => this.render(false));
  }

  render(fixNan = true) {
    const p = parseFloat(this.pSlider.value)
    let n = parseInt(this.nInput.value)
    if (fixNan && Number.isNaN(n)) {
        n = -1;
    }
    if (Number.isNaN(n)) return;
    if (n > 1000) {
      n = 1000;
      this.nInput.value = 1000;
    }
    if (n < 1) {
      n = 1;
      this.nInput.value = 1;
    }

    this.pVal.textContent = p.toFixed(2);

    const data = [];
    for (let k = 0; k <= n; k++) {
      data.push(jStat.binomial.pdf(k, n, p))
    }

    Highcharts.chart(this.graph, {
      chart: {
          type: 'line'
      },
      title: {
          text: `Binomial PDF with n=${n} and p=${p.toFixed(2)}`
      },
      subtitle: {
        text: `Chance of k successes out of ${n} trials, where each trial has ${p.toFixed(2)} chance of success`
    },
      xAxis: {
        title: {
          text: 'Number of successes (k)'
        }
      },
      yAxis: {
          title: {
              text: 'Probability'
          }
      },
      plotOptions: {
        series: {
          animation: false
        }
      },
      tooltip: {
        formatter: function () {
          return `Chance of <b>${this.x}</b> successes is <b>${this.y.toFixed(3)}</b>`;
        }
      },
      series: [{
        data,
        showInLegend: false,
      }],
      credits: {
        enabled: false
      },
  });
  }
}

const binomialPdfElms = Array.from(document.querySelectorAll('.BinomialPdf'));
const binomialPdfs =  binomialPdfElms.map(elm => new BinomialPdf(elm))


// ---- Beta Conversion PDF ---- //


const NUM_BETA_GRAPH_POINTS = 1000;

class BetaConversionPdf {

  constructor(elm) {
    this.numConversionsInput = elm.querySelector('.BetaConversionPdf-numConversions');
    this.numTrialsInput = elm.querySelector('.BetaConversionPdf-numTrials');
    this.graph = elm.querySelector('.BetaConversionPdf-graph');

    this.render();

    this.numConversionsInput.addEventListener('change', () => this.render(true));
    this.numConversionsInput.addEventListener('input', () => this.render(false));
    this.numTrialsInput.addEventListener('change', () => this.render(true));
    this.numTrialsInput.addEventListener('input', () => this.render(false));
  }

  render(fixNan = true) {
    let numTrials = parseFloat(this.numTrialsInput.value)
    let numConversions = parseInt(this.numConversionsInput.value)
    if (fixNan && Number.isNaN(numTrials)) {
      numTrials = -1;
    }
    if (fixNan && Number.isNaN(numConversions)) {
      numConversions = -1;
    }
    if (Number.isNaN(numTrials) || Number.isNaN(numConversions)) return;
    if (numTrials < 1) {
      numTrials = 1;
      this.numTrialsInput.value = 1;
    }
    if (numConversions > numTrials) {
      numConversions = numTrials;
      this.numConversionsInput.value = numTrials;
    }
    if (numConversions < 0) {
      numConversions = 0;
      this.numConversionsInput.value = 0;
    }

    const alpha = 1 + numConversions;
    const beta = 1 + numTrials - numConversions;

    const data = [];
    for (let k = 0; k < NUM_BETA_GRAPH_POINTS; k++) {
      const x = k / (NUM_BETA_GRAPH_POINTS - 1);
      data.push([x, jStat.beta.pdf(x, alpha, beta)])
    }

    Highcharts.chart(this.graph, {
      chart: {
          type: 'line'
      },
      title: {
          text: `Beta PDF with α=${alpha.toFixed(2)} and β=${beta.toFixed(2)}`
      },
      subtitle: {
        text: `Likely conversion rate of an A/B test variation given ${numConversions} conversions out of ${numTrials} trials`
      },
      xAxis: {
        title: {
          text: 'Conversion rate'
        }
      },
      yAxis: {
          title: {
              text: 'Probability'
          }
      },
      plotOptions: {
        series: {
          animation: false
        },
      },
      tooltip: {
        formatter: function() {
          return `Conversion rate <b>${this.x.toFixed(2)}</b>`;
        }
      },
      series: [{
        data,
        showInLegend: false,
      }],
      credits: {
        enabled: false
      },
    });
  }
}

const betaConversionPdfElms = Array.from(document.querySelectorAll('.BetaConversionPdf'));
const betaConversionPdfs =  betaConversionPdfElms.map(elm => new BetaConversionPdf(elm))


// ---- Conversion Sampler ---- //


class ConversionSampler {
  constructor(elm) {
    const variationElms = elm.querySelectorAll('.ConversionSamplerVariation');
    this.variations = Array.from(variationElms).map(variationElm => new ConversionSamplerVariation(variationElm));
    this.outputPane = elm.querySelector('.ConversionSampler-outputPane');
    this.sampleButton = elm.querySelector('.ConversionSampler-sampleButton');
    this.clearButton = elm.querySelector('.ConversionSampler-clearButton');
    this.samples = [];

    this.sampleButton.addEventListener('click', this.onSample.bind(this));
    this.clearButton.addEventListener('click', this.onClear.bind(this));
  }

  onSample() {
    let winner;
    let maxConversionRate = -1;
    const variationSamples = this.variations.map(variation => {
      const { numTrials, numConversions, title } = variation;
      const alpha = 1 + numConversions;
      const beta = 1 + numTrials - numConversions;
      const conversionRate = jStat.beta.sample(alpha, beta);
      if (conversionRate > maxConversionRate) {
        maxConversionRate = conversionRate;
        winner = title;
      }
      return { title, conversionRate };
    });
    this.samples.unshift({ variations: variationSamples, winner });
    this.render();
    this.outputPane.scrollTop = 0;
  }

  onClear() {
    this.samples = [];
    this.render();
  }

  render() {
    this.clearButton.classList.toggle('hidden', this.samples.length === 0);
    const variationCounts = {};
    for (const variation of this.variations) {
      variationCounts[variation.title] = 0;
    }
    const sampleHtmlSnippets = this.samples.map((sample, i) => {
      variationCounts[sample.winner] += 1;
      const sampleVariations = sample.variations.map(variation => `
        <div class="ConversionSampler-sampleVariation">
          <span class="ConversionSampler-sampleVariationTitle">${variation.title}</span>
          <span class="ConversionSampler-sampleVariationConversion">${variation.conversionRate.toFixed(3)}</span>
          <span class="ConversionSampler-sampleVariationWinner">${variation.title === sample.winner ? '✔️' : ''}</span>
        </div>
      `)
      return `
        <div class="ConversionSampler-sample">
          ${sampleVariations.join('\n')}
          <div class="ConversionSampler-sampleWinner">User ${this.samples.length - i} sees ${sample.winner}</div>
        </div>
      `
    });

    const variationCountHtmlSnippets = Object.entries(variationCounts).map(([title, count]) => {
      const percent = 100 * (count / this.samples.length);
      return `
        <div class="ConversionSampler-sampleCount">
          <b>${title}:</b> picked ${count} times (${percent.toFixed(1)}%)
        </div>
      `
    })
    const variationCountsHtml = this.samples.length === 0 ? '' : `
      <div class="ConversionSampler-sampleCounts">
        ${variationCountHtmlSnippets.join("\n")}
      </div>
    `

    const sampleScrollHtml = this.samples.length === 0 ? '' : `
      <div class="ConversionSampler-outputScroll">
        ${sampleHtmlSnippets.join("\n")}
      </div>
    `

    this.outputPane.innerHTML = sampleScrollHtml + variationCountsHtml;
  }
}

class ConversionSamplerVariation {
  constructor(elm) {
    this.numConversionsInput = elm.querySelector('.ConversionSamplerVariation-numConversions');
    this.numTrialsInput = elm.querySelector('.ConversionSamplerVariation-numTrials');
    this.graph = elm.querySelector('.ConversionSamplerVariation-graph');
    this.titleElm = elm.querySelector('.ConversionSamplerVariation-title')

    this.render();

    this.numConversionsInput.addEventListener('change', () => this.render(true));
    this.numConversionsInput.addEventListener('input', () => this.render(false));
    this.numTrialsInput.addEventListener('change', () => this.render(true));
    this.numTrialsInput.addEventListener('input', () => this.render(false));
  }

  get numTrials() {
    return parseFloat(this.numTrialsInput.value);
  }

  get numConversions() {
    return parseFloat(this.numConversionsInput.value);
  }

  get title() {
    return this.titleElm.textContent;
  }

  render(fixNan = true) {
    let numTrials = parseFloat(this.numTrialsInput.value)
    let numConversions = parseInt(this.numConversionsInput.value)
    if (fixNan && Number.isNaN(numTrials)) {
      numTrials = -1;
    }
    if (fixNan && Number.isNaN(numConversions)) {
      numConversions = -1;
    }
    if (Number.isNaN(numTrials) || Number.isNaN(numConversions)) return;
    if (numTrials < 1) {
      numTrials = 1;
      this.numTrialsInput.value = 1;
    }
    if (numConversions > numTrials) {
      numConversions = numTrials;
      this.numConversionsInput.value = numTrials;
    }
    if (numConversions < 0) {
      numConversions = 0;
      this.numConversionsInput.value = 0;
    }

    const alpha = 1 + numConversions;
    const beta = 1 + numTrials - numConversions;

    const data = [];
    for (let k = 0; k < NUM_BETA_GRAPH_POINTS; k++) {
      const x = k / (NUM_BETA_GRAPH_POINTS - 1);
      data.push([x, jStat.beta.pdf(x, alpha, beta)])
    }

    Highcharts.chart(this.graph, {
      chart: { type: 'line' },
      title: { text: '' },
      yAxis: {
        title: { text: '' },
        tickAmount: 0,
        gridLineWidth: 0,
        labels: { enabled: false },
      },
      xAxis: {
        title: { text: 'Conversion rate' }
      },
      plotOptions: {
        series: {
          animation: false
        },
      },
      tooltip: {
        enabled: false
      },
      series: [{
        data,
        showInLegend: false,
        enableMouseTracking: false,
      }],
      credits: {
        enabled: false
      },
    });
  }
}

const conversionSamplerElms = Array.from(document.querySelectorAll('.ConversionSampler'));
const conversionSamplers =  conversionSamplerElms.map(elm => new ConversionSampler(elm))