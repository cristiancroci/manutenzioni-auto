let interventi = JSON.parse(localStorage.getItem("interventi")) || [];

function formatEuro(v) {
  const n = Number(v || 0);
  return n.toFixed(2);
}

function formatData(d) {
  if (!d) return "—";
  const [y, m, g] = d.split("-");
  return `${g}/${m}/${y}`;
}

function salva() {
  const ric = Number(ricambi.value || 0);
  const man = Number(manodopera.value || 0);

  const nuovo = {
    id: Date.now(),
    tipo: tipo.value || "—",
    data: data.value || "",
    km: km.value || "",
    ricambi: ric,
    manodopera: man,
    totale: ric + man,
    titolo: titolo.value || "",
    note: note.value || ""
  };

  interventi.push(nuovo);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  aggiornaUI("Intervento salvato");
  pulisciCampi();
}

function pulisciCampi() {
  tipo.value = "";
  data.value = "";
  km.value = "";
  ricambi.value = "";
  manodopera.value = "";
  titolo.value = "";
  note.value = "";
}

function nuovo() {
  pulisciCampi();
  aggiornaStato("Nuovo intervento");
}

function svuotaTutto() {
  if (!confirm("Vuoi davvero cancellare tutti gli interventi salvati in locale?")) return;
  interventi = [];
  localStorage.removeItem("interventi");
  aggiornaUI("Tutti gli interventi sono stati rimossi");
}

function elimina(id) {
  if (!confirm("Eliminare questo intervento?")) return;
  interventi = interventi.filter(i => i.id !== id);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  aggiornaUI("Intervento eliminato");
}

function modifica(id) {
  const i = interventi.find(x => x.id === id);
  if (!i) return;

  tipo.value = i.tipo;
  data.value = i.data;
  km.value = i.km;
  ricambi.value = i.ricambi;
  manodopera.value = i.manodopera;
  titolo.value = i.titolo;
  note.value = i.note;

  interventi = interventi.filter(x => x.id !== id);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  aggiornaUI("Modifica in corso (salva per aggiornare)");
}

function aggiornaUI(msg) {
  mostraLista();
  aggiornaStato(msg);
  const ora = new Date();
  ultimo-salvataggio.textContent = ora.toLocaleString();
}

function aggiornaStato(msg) {
  stato.textContent = msg;
}

function mostraLista() {
  lista.innerHTML = "";
  let totale = 0;

  interventi.forEach((i) => {
    totale += i.totale;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="riga-top">
        <span>${formatData(i.data)} · ${i.km || "—"} km</span>
        <span class="tag">${i.tipo}</span>
      </div>
      <div class="riga-mid">
        <strong>${i.titolo || "Senza titolo"}</strong>
      </div>
      <div class="riga-bot">
        <span>Ricambi €${formatEuro(i.ricambi)} · Manodopera €${formatEuro(i.manodopera)} · Totale €${formatEuro(i.totale)}</span>
        <div class="azioni">
          <button onclick="modifica(${i.id})">Modifica</button>
          <button onclick="elimina(${i.id})">Elimina</button>
        </div>
      </div>
      ${i.note ? `<div class="riga-note">${i.note}</div>` : ""}
    `;

    lista.appendChild(li);
  });

  conteggio.textContent = `${interventi.length} interventi`;
  totale.textContent = formatEuro(totale);
}

mostraLista();
aggiornaStato("Pronto");
