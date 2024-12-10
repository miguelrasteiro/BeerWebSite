
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
  
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();

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
          window.location.href = "/admin.html";
        } else {
          window.location.href = "/user.html";
        }
      });
    } catch (error) {
      alert(error.message);
    }
  });

////////////////////////////////////////////



  const beerList = document.getElementById("beer-list");

  function loadBeers() {
    const beersRef = db.ref("beers");
    beersRef.on("value", (snapshot) => {
      beerList.innerHTML = ""; // Limpa a lista antes de renderizar
      snapshot.forEach((childSnapshot) => {
        const beer = childSnapshot.val();
        const beerId = childSnapshot.key;
  
        // Cria elementos HTML para exibir os detalhes da cerveja
        const beerDiv = document.createElement("div");
        beerDiv.innerHTML = `
          <h3>${beer.tipo}</h3>
          <p>${beer.descricao.cor} | ${beer.descricao.alcool} | ${beer.descricao.ibu} | ${beer.descricao.lupulos}</p>
          <p>Quantidade: ${beer.quantidade}</p>
          <p>Produzido em: ${beer.data_producao} | Válido até: ${beer.data_validade}</p>
          <button onclick="editBeer('${beerId}')">Editar</button>
          <button onclick="deleteBeer('${beerId}')">Excluir</button>
        `;
        beerList.appendChild(beerDiv);
      });
    });
  }
  
  // Carrega a lista ao carregar a página
  loadBeers();
    


  /////////////////////////////////////////



  document.getElementById("beer-form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const beerType = document.getElementById("beer-type").value;
    const beerDescription = document.getElementById("beer-description").value.split(", ");
    const beerQuantity = document.getElementById("beer-quantity").value;
    const beerProductionDate = document.getElementById("beer-production-date").value;
    const beerExpiryDate = document.getElementById("beer-expiry-date").value;
  
    // Construir o objeto cerveja
    const newBeer = {
      tipo: beerType,
      descricao: {
        cor: beerDescription[0],
        alcool: beerDescription[1],
        ibu: beerDescription[2],
        lupulos: beerDescription[3]
      },
      quantidade: parseInt(beerQuantity, 10),
      data_producao: beerProductionDate,
      data_validade: beerExpiryDate
    };
  
    // Adiciona ou edita cerveja no banco
    const beerId = document.getElementById("beer-id")?.value || db.ref("beers").push().key; // Novo ID se não for edição
    db.ref(`beers/${beerId}`).set(newBeer);
  
    alert("Cerveja salva com sucesso!");
    document.getElementById("beer-form").reset();
  });

  


  //////////////////////////////////


  function deleteBeer(beerId) {
    if (confirm("Tem certeza que deseja excluir esta cerveja?")) {
      db.ref(`beers/${beerId}`).remove();
      alert("Cerveja excluída com sucesso!");
    }
  }

  
  ////////////////////////////////////////

  function editBeer(beerId) {
    const beerRef = db.ref(`beers/${beerId}`);
    beerRef.once("value").then((snapshot) => {
      const beer = snapshot.val();
  
      // Preenche o formulário com os dados da cerveja
      document.getElementById("beer-type").value = beer.tipo;
      document.getElementById("beer-description").value = `${beer.descricao.cor}, ${beer.descricao.alcool}, ${beer.descricao.ibu}, ${beer.descricao.lupulos}`;
      document.getElementById("beer-quantity").value = beer.quantidade;
      document.getElementById("beer-production-date").value = beer.data_producao;
      document.getElementById("beer-expiry-date").value = beer.data_validade;
      document.getElementById("beer-id").value = beerId; // Armazena o ID para edição
    });
  }
  