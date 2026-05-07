let interventi = JSON.parse(localStorage.getItem("interventi")) || [];

function salva() {
  const nuovo = {
    id: Date.now(),
    km: km.value,
    costo: costo.value,
    manodopera: manodopera.value,
    ricambi: ricambi.value,
    descrizione: descrizione.value
  };

  interventi.push(nuovo);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  km.value = costo.value = manodopera.value = ricambi.value = descrizione.value = "";
  mostraLista();
}

function mostraLista() {
  lista.innerHTML = "";
  interventi.forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${i.km} km — €${i.costo} — ${i.descrizione}</span>
      <button onclick="modifica(${i.id})">✏️</button>
      <button onclick="elimina(${i.id})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

function elimina(id) {
  interventi = interventi.filter(i => i.id !== id);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  mostraLista();
}

function modifica(id) {
  const i = interventi.find(x => x.id === id);
  if (!i) return;
  km.value = i.km;
  costo.value = i.costo;
  manodopera.value = i.manodopera;
  ricambi.value = i.ricambi;
  descrizione.value = i.descrizione;
  elimina(id);
}

mostraLista();
