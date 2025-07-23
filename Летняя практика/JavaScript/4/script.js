const config = {
  maxDataPoints: 20,
  apiEndpoint: 'http://exercise.develop.maximaster.ru/service/cpu/',
  updateInterval: 5000,
  credentials: {
    username: 'cli',    
    password: '12344321'    
  }
};

const state = {
  timeLabels: [],
  cpuData: [],
  lastValidValue: 50,
  stats: {
    totalRequests: 0,
    errorRequests: 0,
    successRequests: 0
  },
  chart: null
};

document.addEventListener('DOMContentLoaded', function() {
  initializeChart();
  fetchCpuUsage(); 
  setInterval(fetchCpuUsage, config.updateInterval);
});

function initializeChart() {
  const ctx = document.getElementById('cpuChart').getContext('2d');
  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: state.timeLabels,
      datasets: [{
        label: 'Загрузка процессора (%)',
        data: state.cpuData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Загрузка (%)' }
        },
        x: {
          title: { display: true, text: 'Время' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });
}

async function fetchCpuUsage() {
  try {
    state.stats.totalRequests++;
    
    const response = await fetch(config.apiEndpoint, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${config.credentials.username}:${config.credentials.password}`)
      }
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const textData = await response.text();
    const cpuUsage = parseInt(textData);
    
    processResponse(cpuUsage);
  } catch (error) {
    console.error('Ошибка запроса:', error);
    handleError();
  } finally {
    updateChart();
    updateStats();
  }
}

function processResponse(cpuUsage) {
  if (cpuUsage === 0 || isNaN(cpuUsage)) {
    state.stats.errorRequests++;
    state.cpuData.push(state.lastValidValue);
  } else {
    state.stats.successRequests++;
    state.lastValidValue = cpuUsage;
    state.cpuData.push(cpuUsage);
  }
  
  const now = new Date();
  state.timeLabels.push(now.toLocaleTimeString());
  
  if (state.timeLabels.length > config.maxDataPoints) {
    state.timeLabels.shift();
    state.cpuData.shift();
  }
}

function handleError() {
  state.stats.errorRequests++;
  state.cpuData.push(state.lastValidValue);
  const now = new Date();
  state.timeLabels.push(now.toLocaleTimeString());
  
  if (state.timeLabels.length > config.maxDataPoints) {
    state.timeLabels.shift();
    state.cpuData.shift();
  }
}

function updateChart() {
  state.chart.data.labels = state.timeLabels;
  state.chart.data.datasets[0].data = state.cpuData;
  state.chart.update();
}

function updateStats() {
  document.getElementById('totalRequests').textContent = state.stats.totalRequests;
  document.getElementById('errorRequests').textContent = state.stats.errorRequests;
  
  const errorPercentage = state.stats.totalRequests > 0 
    ? (state.stats.errorRequests / state.stats.totalRequests * 100).toFixed(2)
    : '0.00';
    
  document.getElementById('errorPercentage').textContent = errorPercentage;
}