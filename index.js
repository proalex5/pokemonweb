import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// CONFIGURACIÓN FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyC9UfW6Tnnig9a5B-E0Nu73Mhro2ck-XHo",
    authDomain: "torneopokemon-86318.firebaseapp.com",
    databaseURL: "https://torneopokemon-86318-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "torneopokemon-86318",
    storageBucket: "torneopokemon-86318.firebasestorage.app",
    appId: "1:682695753268:web:9aedbdb22bf1561dc69461"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ELEMENTOS DEL DOM
const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const dynamicContent = document.getElementById('dynamic-content');
const btnBack = document.getElementById('back-btn');

// --- 1. GESTIÓN DE SESIÓN ---
const entrenadorId = localStorage.getItem('entrenadorId');
const authSection = document.getElementById('auth-section');
const userMenu = document.getElementById('user-menu');
const btnLogin = document.getElementById('btn-login');

if (entrenadorId) {
    btnLogin.classList.add('hidden');
    userMenu.classList.remove('hidden');
    
    // Obtener nombre real del usuario logueado
    get(ref(db, `Clientes/${entrenadorId}`)).then(snapshot => {
        if (snapshot.exists()) {
            document.getElementById('display-name').textContent = snapshot.val().nombre;
        }
    });

    // Menú desplegable
    document.getElementById('profile-trigger').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('dropdown').classList.toggle('hidden');
    };

    // Cerrar sesión
    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('entrenadorId');
        window.location.reload();
    };
}

// Cerrar dropdown al hacer click fuera
window.onclick = () => document.getElementById('dropdown').classList.add('hidden');


// --- 2. CARGAR RANKING TOTAL (COLUMNA IZQUIERDA) ---
onValue(ref(db, 'RankingTotal'), (snapshot) => {
    const rankingBody = document.getElementById('ranking-body');
    const data = snapshot.val();
    rankingBody.innerHTML = "";

    if (data) {
        // Ordenar por puntos totales de mayor a menor
        const sorted = Object.entries(data).sort((a, b) => b[1].puntosTotales - a[1].puntosTotales);
        
        sorted.forEach(([id, info]) => {
            rankingBody.innerHTML += `
                <tr>
                    <td style="text-transform: capitalize;"><strong>${id}</strong></td>
                    <td>${info.torneosJugados}</td>
                    <td style="color: #ffd700; font-weight: bold;">${info.puntosTotales} PTS</td>
                </tr>`;
        });
    }
});


// --- 3. CARGAR TARJETAS DE TORNEOS (COLUMNA DERECHA) ---
onValue(ref(db, 'Torneos'), (snapshot) => {
    const listaTorneos = document.getElementById('lista-torneos');
    const torneos = snapshot.val();
    listaTorneos.innerHTML = "";

    for (let tId in torneos) {
        // Aquí puedes asignar imágenes locales o URLs. 
        // Si no tienes, se verá el color de fondo por defecto.
        const bgImg = tId === 'super_gey' ? 'url("img/gey_bg.jpg")' : 'url("img/espana_bg.jpg")';

        const card = document.createElement('div');
        card.className = 'card-torneo';
        card.style.backgroundImage = bgImg;
        card.innerHTML = `
            <h3>${torneos[tId].titulo}</h3>
            <button class="btn-action">Ver Resultados</button>
        `;
        card.onclick = () => verDetalleTorneo(tId);
        listaTorneos.appendChild(card);
    }
});


// --- 4. VISTA DE DETALLE (PODIO + TABLA) ---
window.verDetalleTorneo = (tId) => {
    get(ref(db, `Torneos/${tId}`)).then(snapshot => {
        if (snapshot.exists()) {
            const torneo = snapshot.val();
            const participantes = Object.entries(torneo.participantes).sort((a, b) => b[1].puntos - a[1].puntos);

            mainView.classList.add('hidden');
            detailView.classList.remove('hidden');

            // Construir el HTML del Podio
            let htmlPodio = `<div class="podium">`;
            // Segundo Lugar
            if (participantes[1]) {
                htmlPodio += `<div class="rank-box rank-2"><span>2º</span><br>${participantes[1][0].toUpperCase()}<br><small>${participantes[1][1].puntos} Pts</small></div>`;
            }
            // Primer Lugar
            if (participantes[0]) {
                htmlPodio += `<div class="rank-box rank-1"><span>1º</span><br>${participantes[0][0].toUpperCase()}<br><small>${participantes[0][1].puntos} Pts</small></div>`;
            }
            // Tercer Lugar
            if (participantes[2]) {
                htmlPodio += `<div class="rank-box rank-3"><span>3º</span><br>${participantes[2][0].toUpperCase()}<br><small>${participantes[2][1].puntos} Pts</small></div>`;
            }
            htmlPodio += `</div>`;

            // Construir la Tabla Completa
            let htmlTabla = `
                <table class="table-modern">
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Entrenador</th>
                            <th>V</th>
                            <th>D</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            participantes.forEach((p, index) => {
                htmlTabla += `
                    <tr>
                        <td>${index + 1}</td>
                        <td style="text-transform: capitalize;">${p[0]}</td>
                        <td>${p[1].victorias}</td>
                        <td>${p[1].derrotas}</td>
                        <td style="color: #ffd700;">${p[1].puntos}</td>
                    </tr>`;
            });

            htmlTabla += `</tbody></table>`;

            dynamicContent.innerHTML = `<h1>${torneo.titulo}</h1>` + htmlPodio + htmlTabla;
        }
    });
};

// Botón volver
btnBack.onclick = () => {
    detailView.classList.add('hidden');
    mainView.classList.remove('hidden');
};