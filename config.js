/* ============ KOMASKU – config.js ============
 * Ubah maklumat di bawah. Semua halaman guna fail ini.
 */
window.KOMASKU = {
  // URL Web App Google Apps Script (Deploy > Web app > URL berakhir /exec)
  API: 'https://script.google.com/macros/s/AKfycbyQ2Uem-XhPzs9Kj-PPMKwFW5qp7mI1yEOvEz3VjnCZoNwvaxjGlnt_C24CsDOR4b3r/exec',

  ALAMAT: 'Lot 2456, Kampung Kundur Hulu, 71400 Pedas, Negeri Sembilan',
  WAKTU: [
    'Selasa hingga Ahad, 10 pagi hingga 5 petang',
    'Tutup setiap Isnin'
  ],
  TELEFON_PAPAR: '012-383 0649',
  WHATSAPP: '60123830649',            // nombor WhatsApp KOMASKU, format 60...
  MAPS: 'https://maps.app.goo.gl/YXHbtiTKm6BBo24Y9',

  BANTUAN: 200,
  BONUS: 10
};

/* ---- Fungsi kongsi (jangan ubah) ---- */
async function api(action, data) {
  let r;
  try {
    r = await fetch(KOMASKU.API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ action: action }, data || {}))
    });
  } catch (e) {
    throw new Error('Tiada sambungan internet. Semak data atau WiFi, kemudian cuba lagi.');
  }
  const j = await r.json();
  if (!j.ok) throw new Error(j.ralat || 'Ralat sistem. Cuba lagi.');
  return j;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function rm(n) { return 'RM' + (Number(n) || 0).toFixed(2); }

function waLink(telefon, teks) {
  let d = String(telefon || '').replace(/\D/g, '');
  if (d.indexOf('0') === 0) d = '6' + d;
  return 'https://wa.me/' + d + '?text=' + encodeURIComponent(teks);
}

function tarikh(iso, masa) {
  if (!iso) return '';
  const b = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogo','Sep','Okt','Nov','Dis'];
  const [y, m, d] = iso.slice(0, 10).split('-');
  return Number(d) + ' ' + b[Number(m) - 1] + (masa && iso.length > 15 ? ', ' + iso.slice(11, 16) : '');
}

function isiInfoKedai(root) {
  (root || document).querySelectorAll('[data-k]').forEach(el => {
    const k = el.getAttribute('data-k');
    if (k === 'WAKTU') el.innerHTML = KOMASKU.WAKTU.map(esc).join('<br>');
    else if (k === 'MAPS') el.href = KOMASKU.MAPS;
    else if (k === 'WA') el.href = 'https://wa.me/' + KOMASKU.WHATSAPP;
    else el.textContent = KOMASKU[k];
  });
}

function simpan(k, v, kekal) {
  try { const s = kekal ? localStorage : sessionStorage; v == null ? s.removeItem(k) : s.setItem(k, v); } catch (e) {}
}
function ambil(k, kekal) {
  try { return (kekal ? localStorage : sessionStorage).getItem(k); } catch (e) { return null; }
}

function toast(t) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = t;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* Dialog: perlukan <dialog id="dlg"><div id="dlgIsi"></div></dialog> */
function buka(html) {
  const d = document.getElementById('dlg');
  document.getElementById('dlgIsi').innerHTML = html;
  if (!d.open) d.showModal();
  if (!d._ikat) { d._ikat = 1; d.addEventListener('click', e => { if (e.target === d) d.close(); }); }
}
function tutup() { const d = document.getElementById('dlg'); if (d.open) d.close(); }
function ralatHtml(m) { return '<div class="mesej ralat">' + esc(m) + '</div>'; }

async function salinTeks(t, mesej) {
  try { await navigator.clipboard.writeText(t); toast(mesej || 'Disalin'); }
  catch (e) { prompt('Salin teks ini:', t); }
}

const LABEL_STATUS = { BARU: 'Baru, belum bayar', DIBAYAR: 'Dibayar', DISIAPKAN: 'Disiapkan', DIHANTAR: 'Dihantar', SELESAI: 'Selesai', BATAL: 'Batal' };
