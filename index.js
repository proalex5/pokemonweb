import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

// Manejo de Sesión
const entrenadorId = localStorage.getItem('entrenadorId');
if (entrenadorId) {
    document.getElementById('btn-login').classList.add('hidden');
    document.getElementById('user-menu').classList.remove('hidden');
    get(ref(db, `Clientes/${entrenadorId}`)).then(s => {
        if(s.exists()) document.getElementById('display-name').textContent = s.val().nombre;
    });
}

// Navegación entre vistas
const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const content = document.getElementById('dynamic-content');

document.getElementById('back-btn').onclick = () => {
    detailView.classList.add('hidden');
    mainView.classList.remove('hidden');
};

// Función para mostrar el Ranking Global
document.getElementById('view-ranking-btn').onclick = () => {
    onValue(ref(db, 'RankingTotal'), (snapshot) => {
        const data = snapshot.val();
        mainView.classList.add('hidden');
        detailView.classList.remove('hidden');
        
        let html = '<h1>RANKING GLOBAL HISTÓRICO</h1><table class="table-modern"><tr><th>Jugador</th><th>Torneos</th><th>Puntos Totales</th></tr>';
        for (let id in data) {
            html += `<tr><td>${id.toUpperCase()}</td><td>${data[id].torneosJugados}</td><td>${data[id].puntosTotales}</td></tr>`;
        }
        html += '</table>';
        content.innerHTML = html;
    });
};

// Función para listar Torneos (Super geY / Ultra España)
document.getElementById('view-torneos-btn').onclick = () => {
    onValue(ref(db, 'Torneos'), (snapshot) => {
        const torneos = snapshot.val();
        mainView.classList.add('hidden');
        detailView.classList.remove('hidden');
        
        let html = '<h1>TORNEOS ACTIVOS</h1><div class="container">';
        for (let tId in torneos) {
            html += `
                <div class="main-card" onclick="verResultadosTorneo('${tId}')">
                    <h2>${torneos[tId].titulo}</h2>
                    <button class="btn-action">Ver Resultados</button>
                </div>`;
        }
        html += '</div>';
        content.innerHTML = html;
    });
};

// Función para ver el PODIO y TABLA de un torneo específico
window.verResultadosTorneo = (tId) => {
    get(ref(db, `Torneos/${tId}`)).then(s => {
        const t = s.val();
        const participantes = Object.entries(t.participantes).sort((a,b) => b[1].puntos - a[1].puntos);
        
        let html = `<h1>${t.titulo}</h1><div class="podium">`;
        // Top 3
        if(participantes[1]) html += `<div class="rank-box rank-2">2º<br>${participantes[1][0]}<br>${participantes[1][1].puntos} pts</div>`;
        if(participantes[0]) html += `<div class="rank-box rank-1">1º<br>${participantes[0][0]}<br>${participantes[0][1].puntos} pts</div>`;
        if(participantes[2]) html += `<div class="rank-box rank-3">3º<br>${participantes[2][0]}<br>${participantes[2][1].puntos} pts</div>`;
        
        html += `</div><table class="table-modern"><tr><th>Pos</th><th>Jugador</th><th>V</th><th>D</th><th>Puntos</th></tr>`;
        participantes.forEach((p, index) => {
            html += `<tr><td>${index+1}</td><td>${p[0]}</td><td>${p[1].victorias}</td><td>${p[1].derrotas}</td><td>${p[1].puntos}</td></tr>`;
        });
        html += '</table>';
        content.innerHTML = html;
    });
};