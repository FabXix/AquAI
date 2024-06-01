document.addEventListener('DOMContentLoaded', function () {
    const phHistory = [];
    const electronegativityHistory = [];
    const temperatureHistory = [];

    function getRandomValue(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }

    function getRandomRecommendation(recommendations) {
        return recommendations[Math.floor(Math.random() * recommendations.length)];
    }

    function getRecommendations(sectionId, value, average) {
        const recommendations = {
            ph: {
                low: [
                    'Añadir bicarbonato de sodio.',
                    'Utilizar agentes alcalinizantes.',
                    'Incrementar la aireación del agua.'
                ],
                normal: [
                    'El pH está en el rango óptimo.',
                    'Mantener un monitoreo regular del pH.'
                ],
                high: [
                    'Añadir ácido muriático.',
                    'Usar agentes acidificantes.',
                    'Reducir la aireación del agua.'
                ]
            },
            electronegativity: {
                low: [
                    'Añadir bicarbonato de sodio.',
                    'Utilizar agentes alcalinizantes.',
                    'Incrementar la aireación del agua.'
                ],
                normal: [
                    'La electronegatividad está en el rango óptimo.',
                    'Mantener un monitoreo regular de la electronegatividad.'
                ],
                high: [
                    'Diluir con agua destilada.',
                    'Usar resinas de intercambio iónico.',
                    'Añadir agentes quelantes.'
                ]
            },
            temperature: {
                low: [
                    'Utilizar calentadores de agua.',
                    'Aumentar la exposición al sol.',
                    'Incrementar la circulación del agua.'
                ],
                normal: [
                    'La temperatura está en el rango óptimo.',
                    'Mantener un monitoreo regular de la temperatura.'
                ],
                high: [
                    'Usar sistemas de enfriamiento.',
                    'Aumentar la sombra sobre el agua.',
                    'Reducir la exposición directa al sol.'
                ]
            }
        };

        if (value < average * 0.8) {
            return getRandomRecommendation(recommendations[sectionId].low);
        } else if (value > average * 1.5) {
            return getRandomRecommendation(recommendations[sectionId].high);
        } else {
            return getRandomRecommendation(recommendations[sectionId].normal);
        }
    }

    function addActivityLog(sectionId, value, average) {
        const activityLog = document.getElementById('activity-log');
        const timestamp = new Date().toLocaleTimeString();
        let message = '';

        if (sectionId === 'ph') {
            if (value < average * 0.8) {
                message = `El pH está más bajo de lo normal`;
            } else if (value > average * 1.2 && value <= average * 1.5) {
                message = `El pH está más alto de lo normal`;
            } else if (value > average * 1.5) {
                message = `El pH está peligrosamente alto`;
            }
        } else if (sectionId === 'electronegativity') {
            if (value < average * 0.8) {
                message = `La electronegatividad está más baja de lo normal`;
            } else if (value > average * 1.2 && value <= average * 1.5) {
                message = `La electronegatividad está más alta de lo normal`;
            } else if (value > average * 1.5) {
                message = `La electronegatividad está peligrosamente alta`;
            }
        } else if (sectionId === 'temperature') {
            if (value < average * 0.8) {
                message = `La temperatura está más baja de lo normal`;
            } else if (value > average * 1.2 && value <= average * 1.5) {
                message = `La temperatura está más alta de lo normal`;
            } else if (value > average * 1.5) {
                message = `La temperatura está peligrosamente alta`;
            }
        }

        const color = value < average * 0.8 ? 'grey' : value > average * 1.5 ? 'red' : 'yellow';
        if (message) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${color}`;
            logEntry.innerHTML = `${timestamp} - ${message} <span>⚠️</span>`;
            activityLog.prepend(logEntry);
        }
    }

    function setSectionData(sectionId, value, average) {
        const valueElement = document.getElementById(`${sectionId}-value`);
        const averageElement = document.getElementById(`${sectionId}-average`);
        const recommendationsElement = document.getElementById(`${sectionId}-recommendations`);
        const chart = document.getElementById(`${sectionId}-chart`).getContext('2d');

        valueElement.textContent = `Valor Actual: ${value}`;
        averageElement.textContent = `Promedio: ${average}`;

        const recommendation = getRecommendations(sectionId, value, average);
        recommendationsElement.innerHTML = `Recomendación: ${recommendation}`;

        const colorClass = value < average * 0.8 ? 'grey' : value > average * 1.5 ? 'red' : value > average * 1.2 ? 'yellow' : 'green';
        valueElement.className = `value ${colorClass}`;

        addActivityLog(sectionId, value, average);

        if (window[`${sectionId}Chart`]) {
            window[`${sectionId}Chart`].destroy();
        }

        window[`${sectionId}Chart`] = new Chart(chart, {
            type: 'line',
            data: {
                labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
                datasets: [{
                    label: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
                    data: Array.from({ length: 10 }, () => getRandomValue(average * 0.8, average * 1.2)),
                    borderColor: colorClass,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    function updateValues() {
        const phValue = getRandomValue(6, 8);
        const phAverage = 7.0;
        setSectionData('ph', phValue, phAverage);
        phHistory.push({ timestamp: new Date().toLocaleString(), value: phValue });

        const electronegativityValue = getRandomValue(2, 4);
        const electronegativityAverage = 3.0;
        setSectionData('electronegativity', electronegativityValue, electronegativityAverage);
        electronegativityHistory.push({ timestamp: new Date().toLocaleString(), value: electronegativityValue });

        const temperatureValue = getRandomValue(15, 30);
        const temperatureAverage = 22.5;
        setSectionData('temperature', temperatureValue, temperatureAverage);
        temperatureHistory.push({ timestamp: new Date().toLocaleString(), value: temperatureValue });

        populateHistoryTable('ph', phHistory);
        populateHistoryTable('electronegativity', electronegativityHistory);
        populateHistoryTable('temperature', temperatureHistory);
    }

    function showMainContent() {
        document.querySelector('header').style.display = 'block';
        document.querySelector('main').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
        document.body.style.overflow = 'auto';
    }

    const toggleButton = document.getElementById('toggle-activity');
    toggleButton.addEventListener('click', () => {
        const activityLog = document.getElementById('activity-log');
        if (activityLog.classList.contains('minimized')) {
            activityLog.classList.remove('minimized');
            toggleButton.textContent = 'Minimizar';
        } else {
            activityLog.classList.add('minimized');
            toggleButton.textContent = 'Maximizar';
        }
    });

    function toggleDefinition(id) {
        const definition = document.getElementById(id);
        if (definition.style.display === 'none' || definition.style.display === '') {
            definition.style.display = 'block';
        } else {
            definition.style.display = 'none';
        }
    }

    document.getElementById('ph-info').addEventListener('click', () => toggleDefinition('ph-definition'));
    document.getElementById('electronegativity-info').addEventListener('click', () => toggleDefinition('electronegativity-definition'));
    document.getElementById('temperature-info').addEventListener('click', () => toggleDefinition('temperature-definition'));

    function populateHistoryTable(sectionId, history) {
        const table = document.getElementById(`${sectionId}-history-table`);
        table.innerHTML = `
            <tr>
                <th>Fecha y Hora</th>
                <th>Valor</th>
            </tr>
            ${history.map(entry => `
                <tr>
                    <td>${entry.timestamp}</td>
                    <td>${entry.value}</td>
                </tr>
            `).join('')}
        `;
    }

    function exportToExcel(sectionId, history) {
        const worksheet = XLSX.utils.json_to_sheet(history);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${sectionId}History`);
        XLSX.writeFile(workbook, `${sectionId}-history.xlsx`);
    }

    document.getElementById('export-ph-excel').addEventListener('click', () => {
        exportToExcel('ph', phHistory);
    });

    document.getElementById('export-electronegativity-excel').addEventListener('click', () => {
        exportToExcel('electronegativity', electronegativityHistory);
    });

    document.getElementById('export-temperature-excel').addEventListener('click', () => {
        exportToExcel('temperature', temperatureHistory);
    });

    setInterval(updateValues, 5000);

    document.getElementById('view-ph-history').addEventListener('click', () => {
        const table = document.getElementById('ph-history-table');
        table.style.display = table.style.display === 'none' || table.style.display === '' ? 'table' : 'none';
    });

    document.getElementById('view-electronegativity-history').addEventListener('click', () => {
        const table = document.getElementById('electronegativity-history-table');
        table.style.display = table.style.display === 'none' || table.style.display === '' ? 'table' : 'none';
    });

    document.getElementById('view-temperature-history').addEventListener('click', () => {
        const table = document.getElementById('temperature-history-table');
        table.style.display = table.style.display === 'none' || table.style.display === '' ? 'table' : 'none';
    });

    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
        showMainContent();
        updateValues();
    }, 3000);
});
