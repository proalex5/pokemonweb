import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9UfW6Tnnig9a5B-E0Nu73Mhro2ck-XHo",
    authDomain: "torneopokemon-86318.firebaseapp.com",
    databaseURL: "https://torneopokemon-86318-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "torneopokemon-86318",
    storageBucket: "torneopokemon-86318.firebasestorage.app",
    messagingSenderId: "682695753268",
    appId: "1:682695753268:web:9aedbdb22bf1561dc69461"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- LÓGICA DE SESIÓN Y PERFIL ---
const entrenadorId = localStorage.getItem('entrenadorId');

if (entrenadorId) {
    document.getElementById('btn-to-login').classList.add('hidden');
    document.getElementById('user-area').classList.remove('hidden');

    // Obtener nombre del entrenador para el saludo
    get(ref(db, `Clientes/${entrenadorId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById('user-name-display').textContent = snapshot.val().nombre;
        }
    });

    // Control del desplegable
    const trigger = document.getElementById('profile-trigger');
    const dropdown = document.getElementById('user-dropdown');

    trigger.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    };

    // Cerrar sesión
    document.getElementById('btn-logout').onclick = () => {
        localStorage.removeItem('entrenadorId');
        window.location.reload();
    };

    // Cerrar menú al hacer clic fuera
    window.onclick = () => dropdown.classList.remove('show');
}

// --- CARGAR RANKING (Igual que antes) ---
onValue(ref(db, 'Clientes'), (snapshot) => {
    const usuarios = snapshot.val();
    const tabla = document.getElementById('tabla-puntos');
    tabla.innerHTML = "";
    for (let id in usuarios) {
        tabla.innerHTML += `
            <div class="user-row">
                <span>${usuarios[id].nombre}</span>
                <span style="font-weight:bold;">${usuarios[id].puntos} PTS</span>
            </div>`;
    }
});