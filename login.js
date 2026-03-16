import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

document.getElementById('btn-entrar').onclick = async () => {
    const u = document.getElementById('user').value.toLowerCase().trim();
    const p = document.getElementById('pass').value;
    const errorMsg = document.getElementById('error');
    
    try {
        const snapshot = await get(ref(db, `Clientes/${u}`));
        if (snapshot.exists() && snapshot.val().contraseña === p) {
            localStorage.setItem('entrenadorId', u); 
            window.location.href = 'panel.html';
        } else {
            errorMsg.style.display = 'block';
        }
    } catch (e) {
        console.error("Error en login:", e);
    }
};