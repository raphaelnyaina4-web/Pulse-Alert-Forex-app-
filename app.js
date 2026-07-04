// Enregistrement du Service Worker pour le mode PWA et arrière-plan
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Service Worker Enregistré !', reg))
    .catch(err => console.warn('Erreur de Service Worker', err));
}

// Gestion de la demande de Notification
const notiBtn = document.getElementById('noti-btn');
notiBtn.addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            alert('Notifications activées avec succès !');
            // Exemple de notification immédiate test
            sendTestNotification();
        }
    });
});

function sendTestNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Suivi Forex', {
                body: 'L’application surveille activement l’Or et vos devises.',
                icon: 'https://cdn-icons-png.flaticon.com/512/2822/2822557.png'
            });
        });
    }
}

// Simulation de récupération de données (Remplacez par votre clé d'API financière)
function fetchMarketData() {
    const container = document.getElementById('prices-container');
    // Ici, nous simulerons des données. En production, vous feriez un fetch('URL_API')
    const simulatedData = [
        { pair: 'EUR/USD', price: '1.0924', change: '+0.15%' },
        { pair: 'USD/JPY', price: '148.52', change: '-0.30%' },
        { pair: 'GOLD (XAU/USD)', price: '2150.80', change: '+1.05%' }
    ];

    container.innerHTML = '';
    simulatedData.forEach(item => {
        const cssClass = item.change.includes('+') ? 'price-up' : 'price-down';
        container.innerHTML += `
            <div class="card">
                <span><strong>${item.pair}</strong></span>
                <span class="${cssClass}">${item.price} (${item.change})</span>
            </div>
        `;
    });
}

// Charger les données au démarrage
window.onload = fetchMarketData;
