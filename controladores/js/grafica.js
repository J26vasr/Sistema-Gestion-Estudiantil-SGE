const ctx = document.getElementById('graficaNotas').getContext('2d');

const graficaNotas = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['7G', '8G', '9G'],
        datasets: [{
            label: 'Mejor Nota',
            data: [92, 88, 95], // <--- Aquí puedes cambiar las notas
            backgroundColor: [
                'rgba(155, 89, 182, 0.8)',
                'rgba(142, 68, 173, 0.8)',
                'rgba(187, 143, 206, 0.8)'
            ],
            borderColor: '#8e44ad',
            borderWidth: 1,
            borderRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    color: '#333',
                    stepSize: 10
                },
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                }
            },
            x: {
                ticks: { color: '#333' },
                grid: { display: false }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: { color: '#6a1b9a' }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: '#6a1b9a',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        }
    }
});
const trs = document.getElementById('TareasRevisar').getContext('2d');

const TareasRevisar = new Chart(trs, {
    type: 'bar',
    data: {
        labels: ['7G', '8G', '9G'],
        datasets: [{
            label: 'Grado con mas tareas pendientes',
            data: [92, 88, 95], // <--- Aquí puedes cambiar las notas
            backgroundColor: [
                'rgba(20, 72, 240, 0.8)',
                'rgba(68, 78, 173, 0.8)',
                'rgba(143, 158, 206, 0.8)'
            ],
            borderColor: '#2a2deeff',
            borderWidth: 1,
            borderRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    color: '#333',
                    stepSize: 10
                },
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                }
            },
            x: {
                ticks: { color: '#333' },
                grid: { display: false }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: { color: '#231b9aff' }
            },
            title: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1b529aff',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        }
    }
});

