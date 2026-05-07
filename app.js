function salvaIntervento() {
  const tipo = document.getElementById("tipo").value;
  const km = document.getElementById("km").value;
  const pezzi = document.getElementById("costoPezzi").value;
  const mano = document.getElementById("costoManodopera").value;
  const note = document.getElementById("note").value;

  const intervento = {
    tipo,
    km,
    pezzi,
    mano,
    note,
    data: new Date().toLocaleString()
  };

  let lista = JSON.parse(localStorage.getItem("manutenzioni")) || [];
  lista.push(intervento);
  localStorage.setItem("manutenzioni", JSON.stringify(lista));

  caricaLista();
}

function caricaLista() {
  const lista = JSON.parse(localStorage.getItem("manutenzioni")) || [];
  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  lista.forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${i.tipo}</strong><br>
      Km: ${i.km}<br>
      Pezzi: €${i.pezzi}<br>
      Manodopera: €${i.mano}<br>
      Note: ${i.note}<br>
      <small>${i.data}</small>
    `;
    ul.appendChild(li);
  });
}

caricaLista();
