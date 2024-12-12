const firebaseConfig = {
    apiKey: "AIzaSyApF1lrZDydzkoAyc3jtudDxdlGTysON2Q",
    authDomain: "esp32-6fe25.firebaseapp.com",
    databaseURL: "https://esp32-6fe25-default-rtdb.firebaseio.com",
    projectId: "esp32-6fe25",
    storageBucket: "esp32-6fe25.appspot.com",
    messagingSenderId: "seu-id",
    appId: "seu-app-id",
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  function getPeso() {
    const pesoRef = database.ref('peso');
    pesoRef.on('value', (snapshot) => {
      const peso = snapshot.val();
      document.getElementById('peso').innerText = peso + " kg";
    });
  }
  
  function getEstoque() {
    const pesoRef = database.ref('peso');
    pesoRef.on('value', (snapshot) => {
      const peso = snapshot.val();
      const porcentagem_estoque = (peso * 1.125 / 50) * 100;
      document.getElementById('estoque').innerText = porcentagem_estoque.toFixed(2) + "%";
    });
  }
  
  getPeso();
  getEstoque();