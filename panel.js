import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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
const userLogeado = localStorage.getItem('entrenadorId');

if (!userLogeado) window.location.href = 'login.html';

// Escuchar datos del usuario logueado
onValue(ref(db, `Clientes/${userLogeado}`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('display-nombre').textContent = data.nombre;
        document.getElementById('display-puntos').textContent = data.puntos;
        document.getElementById('display-vidas').textContent = data.vidas;
    }
});

// Botón Gachapon
document.getElementById('btn-gachapon').onclick = () => {
    const vidas = parseInt(document.getElementById('display-vidas').textContent);
    if (vidas > 0) {
        alert("¡Girando! Conectando con PokéAPI...");
        // update(ref(db, `Clientes/${userLogeado}`), { vidas: vidas - 1 });
    } else {
        alert("No te quedan vidas.");
    }
};