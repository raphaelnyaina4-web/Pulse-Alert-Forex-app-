// Enregistrement du Service Worker pour le mode PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Service Worker Enregistré !', reg))
    .catch(err => console.warn('Erreur de Service Worker', err));
}

// Seuils d'alertes écrits de manière stricte pour éviter les erreurs de compilation
const ALERT_EUR_USD = 1.1000;

// Demande d'autorisation pour les notifications
const notiBtn = document.getElementById('noti-btn');
if (notiBtn) {
    notiBtn.addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                sendNotification('Alertes activées', 'L’application surveille activement le marché.');
            }
        });
    });
}

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

// Récupération des cours en direct
async function fetchMarketData() {
    const container = document.getElementById('prices-container');
    if (!container) return;
    
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
            const rates = data.rates;
            
            // Calcul mathématique précis des taux réciproques
            const eurUsd = (1 / rates.EUR).toFixed(4);
            const usdJpy = rates.JPY.toFixed(2);
            const chfJpy = (rates.JPY / rates.CHF).toFixed(2);
            const chfUsd = (1 / rates.CHF).toFixed(4);
            const goldPrice = 2150.80; 

            // Vérification du seuil d'alerte
            if (parseFloat(eurUsd) >= ALERT_EUR_USD) {
                sendNotification('🚨 Alerte Prix EUR/USD', `Le cours a atteint ${eurUsd}`);
            }

            // Injection propre du code HTML mis à jour
            container.innerHTML = `
                <div class="card"><span><strong>EUR/USD</strong></span><span>${eurUsd}</span></div>
                <div class="card"><span><strong>USD/JPY</strong></span><span>${usdJpy}</span></div>
                <div class="card"><span><strong>CHF/JPY</strong></span><span>${chfJpy}</span></div>
                <div class="card"><span><strong>CHF/USD</strong></span><span>${chfUsd}</span></div>
                <div class="card"><span><strong>GOLD (XAU/USD)</strong></span><span class="price-up">${goldPrice} USD</span></div>
            `;
        }
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Erreur de chargement des cours de change.</p>`;
    }
}

// Chargement initial du script au déploiement de la page
window.onload = fetchMarketData;
setInterval(fetchMarketData, 60000);
