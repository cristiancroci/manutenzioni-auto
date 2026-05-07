const tipoEl = document.getElementById("tipo");
const dataEl = document.getElementById("data");
const kmEl = document.getElementById("km");
const ricambiEl = document.getElementById("ricambi");
const manodoperaEl = document.getElementById("manodopera");
const titoloEl = document.getElementById("titolo");
const noteEl = document.getElementById("note");

const listaEl = document.getElementById("lista");
const conteggioEl = document.getElementById("conteggio");
const totaleSpesoEl = document.getElementById("totale-speso");
const statoEl = document.getElementById("stato");
const ultimoSalvataggioEl = document.getElementById("ultimo-salvataggio");

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
  const ric = Number(ricambiEl.value || 0);
  const man = Number(manodoperaEl.value || 0);

  const nuovo = {
    id: Date.now(),
    tipo: tipoEl.value || "—",
    data: dataEl.value || "",
    km: kmEl.value || "",
    ricambi: ric,
    manodopera: man,
    totale: ric + man,
    titolo: titoloEl.value || "",
    note: noteEl.value || ""
  };

  interventi.push(nuovo);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  aggiornaUI("Intervento salvato");
  pulisciCampi();
}

function pulisciCampi() {
  tipoEl.value = "";
  dataEl.value = "";
  kmEl.value = "";
  ricambiEl.value = "";
  manodoperaEl.value = "";
  titoloEl.value = "";
  noteEl.value = "";
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

  tipoEl.value = i.tipo;
  dataEl.value = i.data;
  kmEl.value = i.km;
  ricambiEl.value = i.ricambi;
  manodoperaEl.value = i.manodopera;
  titoloEl.value = i.titolo;
  noteEl.value = i.note;

  interventi = interventi.filter(x => x.id !== id);
  localStorage.setItem("interventi", JSON.stringify(interventi));
  aggiornaUI("Modifica in corso (salva per aggiornare)");
}

function aggiornaUI(msg) {
  mostraLista();
  aggiornaStato(msg);
  const ora = new Date();
  ultimoSalvataggioEl.textContent = ora.toLocaleString();
}

function aggiornaStato(msg) {
  statoEl.textContent = msg;
}

function mostraLista() {
  listaEl.innerHTML = "";
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
    listaEl.appendChild(li);
  });

  conteggioEl.textContent = `${interventi.length} interventi`;
  totaleSpesoEl.textContent = formatEuro(totale);
}

mostraLista();
aggiornaStato("Pronto");
