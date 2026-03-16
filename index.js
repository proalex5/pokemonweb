import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

onValue(ref(db, 'Clientes'), (snapshot) => {
    const usuarios = snapshot.val();
    const tabla = document.getElementById('tabla-puntos');
    tabla.innerHTML = "";
    
    // Generar las filas con clases CSS para animación
    for (let id in usuarios) {
        const div = document.createElement('div');
        div.className = 'user-row';
        div.innerHTML = `
            <span>${usuarios[id].nombre}</span>
            <span class="value">${usuarios[id].puntos} PTS</span>
        `;
        tabla.appendChild(div);
    }
});