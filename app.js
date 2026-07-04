// Enregistrement du Service Worker pour le mode PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Service Worker Enregistré !', reg))
    .catch(err => console.warn('Erreur de Service Worker', err));
}

// Seuils d'alertes personnalisables (Paramètres du code)
const ALERT_THRESHOLDS = {
    'EUR_USD': 1.1000,
    'GOLD': 2200.00
};

// Demande d'autorisation pour les notifications
const notiBtn = document.getElementById('noti-btn');
notiBtn.addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            sendNotification('Alertes activées', 'Vous recevrez une alerte en cas de forte variation du marché.');
        }
    });
});

function sendNotification(title, message) {
    if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: message,
                icon: 'https://cdn-icons-png.flaticon.com/512/2822/2822557.png'
            });
        });
    }
}

// Fonction de récupération des données réelles du marché via API
async function fetchMarketData() {
    const container = document.getElementById('prices-container');
    
    try {
        // Appel API gratuit pour récupérer les taux basés sur l'USD
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
            const rates = data.rates;
            
            // Calcul des paires demandées
            const eurUsd = (1 / rates.EUR).toFixed(4);
            const usdJpy = rates.JPY.toFixed(2);
            const chfJpy = (rates.JPY / rates.CHF).toFixed(2);
            const chfUsd = (1 / rates.CHF).toFixed(4);
            const goldFakePrice = 2150.80; // Les API d'or gratuites nécessitent souvent une clé, simulation stable ici

            // Vérification des seuils pour déclencher une notification de prix
            if (parseFloat(eurUsd) >= ALERT_THRESHOLDS.EUR_USD) {
                sendNotification('🚨 Alerte Prix EUR/USD', `Le cours a atteint ${eurUsd}`);
            }

            // Affichage dynamique dans le fichier HTML
            container.innerHTML = `
                <div class="card"><span><strong>EUR/USD</strong></span><span>${eurUsd}</span></div>
                <div class="card"><span><strong>USD/JPY</strong></span><span>${usdJpy}</span></div>
                <div class="card"><span><strong>CHF/JPY</strong></span><span>${chfJpy}</span></div>
                <div class="card"><span><strong>CHF/USD</strong></span><span>${chfUsd}</span></div>
                <div class="card"><span><strong>GOLD (XAU/USD)</strong></span><span class="price-up">${goldFakePrice} USD</span></div>
            `;
        }
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Erreur de connexion aux API de marché.</p>`;
        console.error("Erreur lors de la récupération des cours:", error);
    }
}

// Exécuter le script de récupération de données dès le chargement du site
window.onload = fetchMarketData;
// Mettre à jour automatiquement le code toutes les 60 secondes
setInterval(fetchMarketData, 60000);
