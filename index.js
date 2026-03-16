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

// --- 1. LÓGICA PÚBLICA (ESTO CARGA SIEMPRE) ---
// Esta función escucha la carpeta 'Clientes' y actualiza el ranking en tiempo real
onValue(ref(db, 'Clientes'), (snapshot) => {
    const usuarios = snapshot.val();
    const tabla = document.getElementById('tabla-puntos');
    
    if (usuarios) {
        tabla.innerHTML = "";
        // Convertimos el objeto en un array para poder ordenarlos por puntos si quisieras
        for (let id in usuarios) {
            const div = document.createElement('div');
            div.className = 'user-row';
            div.innerHTML = `
                <span>${usuarios[id].nombre}</span>
                <span style="font-weight:bold; color: #4f46e5;">${usuarios[id].puntos} PTS</span>
            `;
            tabla.appendChild(div);
        }
    } else {
        tabla.innerHTML = "<p>No hay datos disponibles.</p>";
    }
});

// --- 2. LÓGICA DE SESIÓN (ESTO SOLO AFECTA AL MENÚ SUPERIOR) ---
const entrenadorId = localStorage.getItem('entrenadorId');

if (entrenadorId) {
    // Si hay sesión, mostramos el área de usuario y ocultamos el botón login
    document.getElementById('btn-to-login').classList.add('hidden');
    document.getElementById('user-area').classList.remove('hidden');

    // Buscamos el nombre del que se ha logueado para saludarle
    get(ref(db, `Clientes/${entrenadorId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById('user-name-display').textContent = snapshot.val().nombre;
        }
    });

    // Control del menú desplegable
    const trigger = document.getElementById('profile-trigger');
    const dropdown = document.getElementById('user-dropdown');

    trigger.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    };

    // Botón de Logout
    document.getElementById('btn-logout').onclick = () => {
        localStorage.removeItem('entrenadorId');
        window.location.reload(); // Recarga la página y vuelve a salir el botón "Entrar"
    };

    // Cerrar el menú si se pincha fuera
    window.onclick = () => {
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    };
}