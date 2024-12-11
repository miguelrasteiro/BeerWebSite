
// Importando os módulos necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6BpHOFDoEerP5d200EtPV8-oMPZnABRs",
  authDomain: "beerbackend-c1820.firebaseapp.com",
  databaseURL: "https://beerbackend-c1820-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "beerbackend-c1820",
  storageBucket: "beerbackend-c1820.firebasestorage.app",
  messagingSenderId: "1041485781360",
  appId: "1:1041485781360:web:87272bbde21a28e84357b5",
  measurementId: "G-L9PQK5SZXG"
};
  
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    const userRef = db.ref(`users/${userId}`);
    userRef.once("value").then((snapshot) => {
      const userData = snapshot.val();
      if (userData.role === "admin") {
        window.location.href = "admin.html"; // Redireciona para a página do Admin
      } else {
        window.location.href = "user.html"; // Redireciona para a página do User
      }
    });
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
});



// Exibir cervejas para os usuários
function loadBeersForUsers() {
  const beerList = document.getElementById("beer-list");
  const beersRef = db.ref("beers");

  beersRef.on("value", (snapshot) => {
    beerList.innerHTML = ""; // Limpa a lista
    snapshot.forEach((childSnapshot) => {
      const beer = childSnapshot.val();
      const beerId = childSnapshot.key;

      // Cria elementos HTML para exibir cada cerveja
      const beerDiv = document.createElement("div");
      beerDiv.innerHTML = `
        <h3>${beer.tipo}</h3>
        <p>${beer.descricao.cor} | ${beer.descricao.alcool} | ${beer.descricao.ibu} | ${beer.descricao.lupulos}</p>
        <p>Quantidade em estoque: ${beer.quantidade}</p>
        <button onclick="reserveBeer('${beerId}', '${beer.tipo}')">Reservar</button>
      `;
      beerList.appendChild(beerDiv);
    });
  });
}


// Reservar cerveja
function reserveBeer(beerId, beerType) {
  const user = auth.currentUser;

  if (!user) {
    alert("Você precisa estar logado para reservar uma cerveja.");
    return;
  }

  const beerRef = db.ref(`beers/${beerId}`);
  beerRef.once("value").then((snapshot) => {
    const beerData = snapshot.val();

    if (beerData.quantidade > 0) {
      // Atualiza o estoque no Firebase
      beerRef.update({
        quantidade: beerData.quantidade - 1,
      });

      // Envia email simulado para a loja
      sendEmailToStore(user.email, beerType);

      alert(`Você reservou uma ${beerType}!`);
    } else {
      alert("Desculpe, esta cerveja está fora de estoque.");
    }
  });
}


// Simular envio de email para a loja
function sendEmailToStore(userEmail, beerType) {
  console.log(`Enviando email para a loja:`);
  console.log(`De: ${userEmail}`);
  console.log(`Assunto: Reserva de Cerveja`);
  console.log(`Mensagem: O usuário reservou uma cerveja do tipo ${beerType}.`);
}

// Exibir cervejas para admins
function loadBeersForAdmin() {
  const beerList = document.getElementById("beer-list");
  const beersRef = db.ref("beers");

  beersRef.on("value", (snapshot) => {
    beerList.innerHTML = ""; // Limpa a lista
    snapshot.forEach((childSnapshot) => {
      const beer = childSnapshot.val();
      const beerId = childSnapshot.key;
      
      const beerDiv = document.createElement("div");
      beerDiv.innerHTML = `
        <h3>${beer.tipo}</h3>
        <p>Quantidade: ${beer.quantidade}</p>
        <button onclick="updateStock('${beerId}')">Alterar Estoque</button>
      `;
      beerList.appendChild(beerDiv);
    });
  });
}

// Função para alterar o estoque
function updateStock(beerId) {
  const newStock = prompt("Digite a nova quantidade:");
  
  if (newStock !== null) {
    const beerRef = db.ref(`beers/${beerId}`);
    beerRef.update({ quantidade: parseInt(newStock) });
    alert("Estoque atualizado!");
  }
}

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      alert("Você saiu com sucesso!");
      window.location.href = "index.html"; // Volta para a página de login
    })
    .catch((error) => {
      console.error("Erro ao sair: ", error);
    });
});
