// 1. Importar las herramientas necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// 2. Tu configuración (La llave maestra)
const firebaseConfig = {
  apiKey: "AIzaSyC9UfW6Tnnig9a5B-E0Nu73Mhro2ck-XHo",
  authDomain: "torneopokemon-86318.firebaseapp.com",
  databaseURL: "https://torneopokemon-86318-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "torneopokemon-86318",
  storageBucket: "torneopokemon-86318.firebasestorage.app",
  messagingSenderId: "682695753268",
  appId: "1:682695753268:web:9aedbdb22bf1561dc69461"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias a los elementos del HTML
const selector = document.getElementById('perfil-selector');
const statsContainer = document.getElementById('stats-container');
const displayNombre = document.getElementById('display-nombre');
const displayPuntos = document.getElementById('display-puntos');
const displayVidas = document.getElementById('display-vidas');

// --- FUNCIÓN A: LLENAR EL SELECTOR AUTOMÁTICAMENTE ---
onValue(ref(db, 'Clientes'), (snapshot) => {
    const usuarios = snapshot.val();
    // Guardamos la opción por defecto
    selector.innerHTML = '<option value="">Selecciona tu perfil</option>';
    
    for (let id in usuarios) {
        let opt = document.createElement('option');
        opt.value = id; // Esto será "alex" o "jaime"
        opt.textContent = usuarios[id].nombre; // Esto será "Alex" o "Jaime"
        selector.appendChild(opt);
    }
});

// --- FUNCIÓN B: CARGAR DATOS CUANDO SE ELIGE USUARIO ---
selector.addEventListener('change', (e) => {
    const userId = e.target.value;
    
    if (userId === "") {
        statsContainer.classList.add('hidden');
        return;
    }

    // Escuchamos los cambios del usuario elegido en tiempo real
    const usuarioRef = ref(db, `Clientes/${userId}`);
    onValue(usuarioRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            displayNombre.textContent = data.nombre;
            displayPuntos.textContent = data.puntos;
            displayVidas.textContent = data.vidas;
            statsContainer.classList.remove('hidden');
        }
    });
});

// --- FUNCIÓN C: EL BOTÓN GACHAPON (LÓGICA INICIAL) ---
document.getElementById('btn-gachapon').addEventListener('click', () => {
    const userId = selector.value;
    const vidasActuales = parseInt(displayVidas.textContent);

    if (vidasActuales > 0) {
        alert("¡Girando Gachapon! (Aquí conectaremos la PokéAPI después)");
        // Ejemplo de cómo restar una vida en Firebase:
        // update(ref(db, `Clientes/${userId}`), { vidas: vidasActuales - 1 });
    } else {
        alert("¡No te quedan vidas!");
    }
});