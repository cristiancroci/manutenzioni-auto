const SCRIPT_URL = "QUI_METTI_IL_TUO_URL_APPS_SCRIPT";

function salva() {
  const data = {
    km: km.value,
    costo: costo.value,
    manodopera: manodopera.value,
    ricambi: ricambi.value,
    descrizione: descrizione.value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  aggiungiAllaLista(data);
}

function aggiungiAllaLista(d) {
  const li = document.createElement("li");
  li.textContent = `${d.km} km — €${d.costo} — ${d.descrizione}`;
  lista.appendChild(li);
}