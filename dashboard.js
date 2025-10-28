import { db } from './firebase.js';
import { ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const statusEl = document.getElementById("status");
if (statusEl) statusEl.innerText = "Firebase: conectado";

function setCount(elId, value) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerText = (value !== null && value !== undefined) ? value + " peças" : "0 peças";
}

const map = {
  amarelo: { countId: 'count-laser', registrosPath: 'registros/laser', tipo: 'Laser CNC', cor: 'Amarelo' },
  vermelho: { countId: 'count-oxicorte', registrosPath: 'registros/oxicorte', tipo: 'Oxicorte', cor: 'Vermelho' },
  verde: { countId: 'count-plasma', registrosPath: 'registros/plasma', tipo: 'Plasma', cor: 'Verde' }
};

let previous = { amarelo: null, vermelho: null, verde: null };

const leiturasRef = ref(db, 'leituras');
onValue(leiturasRef, snapshot => {
  const data = snapshot.val() || {};
  Object.keys(map).forEach(key => {
    const cfg = map[key];
    const value = (data[key] !== undefined && data[key] !== null) ? data[key] : 0;
    setCount(cfg.countId, value);
  });

  // initial load: set previous without pushing
  if (previous.amarelo === null && previous.vermelho === null && previous.verde === null) {
    previous = {
      amarelo: data.amarelo || 0,
      vermelho: data.vermelho || 0,
      verde: data.verde || 0
    };
    return;
  }

  // compare and push records for changes (store total current)
  Object.keys(map).forEach(key => {
    const cfg = map[key];
    const newValue = (data[key] !== undefined && data[key] !== null) ? data[key] : 0;
    const oldValue = previous[key] || 0;
    if (newValue !== oldValue) {
      const now = new Date();
      const record = {
        tipo: cfg.tipo,
        cor: cfg.cor,
        data: now.toISOString().slice(0,10),
        hora: now.toTimeString().slice(0,8),
        ts: Date.now(),
        quantidade: newValue
      };
      try {
        const registrosRef = ref(db, cfg.registrosPath);
        push(registrosRef, record).catch(err => console.error("Erro ao push registro:", err));
      } catch(e) {
        console.error("Erro ao enviar registro:", e);
      }
    }
    previous[key] = newValue;
  });
});

import { onValue as onVal2, ref as ref2 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

function atualizar(tipo, data) {
  const countEl = document.getElementById("count-" + tipo);
  if (!countEl) return;
  if (data) {
    countEl.innerText = Object.keys(data).length + " peças";
  }
}

['oxicorte','plasma','laser'].forEach(tipo => {
  const path = "registros/" + tipo;
  const refDb = ref(db, path);
  onVal2(refDb, snapshot => {
    atualizar(tipo, snapshot.val());
  });
});

window.mostrarRegistros = function(tipo) {
  const lista = document.getElementById("lista-registros");
  if (!lista) return;
  lista.innerHTML = "";
  const refDb = ref(db, "registros/" + tipo);
  onVal2(refDb, snapshot => {
    const data = snapshot.val();
    if (data) {
      Object.values(data).forEach(reg => {
        const li = document.createElement("li");
        if (reg.data && reg.hora) {
          li.innerText = reg.data + " " + reg.hora + " - " + reg.tipo + " (" + (reg.quantidade !== undefined ? reg.quantidade : '') + ")";
        } else if (reg.ts) {
          const d = new Date(reg.ts);
          li.innerText = d.toLocaleString() + " - " + reg.tipo + " (" + (reg.quantidade !== undefined ? reg.quantidade : '') + ")";
        } else {
          li.innerText = JSON.stringify(reg);
        }
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = '<li>Nenhum registro</li>';
    }
  });
}
