/* ==========================================================
   Logika chatbot ekskul
   Membutuhkan: js/data.js (array EKSKUL) dimuat lebih dulu.
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Elemen ---------- */
  const launcher = document.getElementById("cb-launcher");
  const tombol   = document.getElementById("cb-btn");
  const label    = document.getElementById("cb-label");
  const jendela  = document.getElementById("cb-window");
  const tutup    = document.getElementById("cb-close");
  const isiChat  = document.getElementById("cb-body");
  const chips    = document.getElementById("cb-chips");
  const form     = document.getElementById("cb-form");
  const input    = document.getElementById("cb-input");

  let sudahSapa = false;

  /* ---------- Buka / tutup ---------- */
  function toggleChat(buka) {
    const tampil = typeof buka === "boolean" ? buka : !jendela.classList.contains("show");
    jendela.classList.toggle("show", tampil);
    launcher.classList.toggle("open", tampil);
    tombol.setAttribute("aria-expanded", tampil);

    if (tampil) {
      if (!sudahSapa) {
        sudahSapa = true;
        tambahPesan("Halo! Aku asisten ekskul 👋\nTanya soal kegiatan, jadwal, atau lokasi ekskul. Pilih tombol di bawah atau ketik pertanyaanmu.", "bot");
      }
      setTimeout(() => input.focus(), 250);
    }
  }

  /* ---------- Tampilan pesan ---------- */
  function tambahPesan(teks, pengirim) {
    const el = document.createElement("div");
    el.className = "msg " + pengirim;
    el.textContent = teks;
    isiChat.appendChild(el);
    isiChat.scrollTop = isiChat.scrollHeight;
  }

  function balasBot(teks) {
    const mengetik = document.createElement("div");
    mengetik.className = "msg bot typing";
    mengetik.innerHTML = "<i></i><i></i><i></i>";
    isiChat.appendChild(mengetik);
    isiChat.scrollTop = isiChat.scrollHeight;

    setTimeout(() => {
      mengetik.remove();
      tambahPesan(teks, "bot");
    }, 500);
  }

  function kirim(teks) {
    teks = teks.trim();
    if (!teks) return;
    tambahPesan(teks, "user");
    balasBot(buatJawaban(teks));
  }

  /* ---------- Logika jawaban ---------- */
  function cariEkskul(q) {
    return EKSKUL.find(e => e.kunci.some(k => q.includes(k)));
  }

  function jawabanEkskul(e, q) {
    if (/jadwal|kapan|hari|jam/.test(q))
      return `${e.nama}\nJadwal: ${e.jadwal}\nTempat: ${e.tempat}`;
    if (/tempat|lokasi|dimana|di mana/.test(q))
      return `${e.nama} berlatih di: ${e.tempat}`;
    if (/kegiatan|ngapain|belajar apa|isi/.test(q))
      return `${e.nama}\nKegiatan: ${e.kegiatan}`;
    if (/cocok|syarat|siapa/.test(q))
      return `${e.nama} cocok untuk: ${e.cocok}`;

    return `${e.nama}\n${e.info}\n\n` +
           `Kegiatan: ${e.kegiatan}\nCocok untuk: ${e.cocok}\n` +
           `Jadwal: ${e.jadwal}\nTempat: ${e.tempat}\n\n` +
           `Tanya lagi soal jadwal, lokasi, atau kegiatan juga boleh.`;
  }

  function buatJawaban(teks) {
    const q = teks.toLowerCase();
    const ekskul = cariEkskul(q);

    if (ekskul) return jawabanEkskul(ekskul, q);

    if (/^(hai|halo|hi|hello|assalamualaikum|selamat)/.test(q))
      return "Halo! Mau tanya ekskul apa? Pilih salah satu tombol di bawah atau ketik namanya.";
    if (/terima kasih|makasih|thanks/.test(q))
      return "Sama-sama! Semoga ketemu ekskul yang cocok 😊";
    if (/daftar ekskul|semua|list|apa saja|ada apa/.test(q))
      return "Ekskul yang tersedia:\n• " + EKSKUL.map(e => e.nama).join("\n• ");
    if (/daftar|mendaftar|pendaftaran|cara/.test(q))
      return 'Cara daftar: isi Formulir Pendaftaran Ekstrakurikuler (nama, NIS, kelas, nomor HP, email), pilih ekskul dari menu, lalu tekan "Daftar Sekarang".';

    return 'Maaf, aku belum paham. Coba sebut nama ekskulnya, misalnya "futsal" atau "jadwal padus". Ketik "daftar ekskul" untuk melihat semuanya.';
  }

  /* ---------- Tombol pilihan cepat ---------- */
  EKSKUL.forEach(e => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "cb-chip";
    chip.textContent = e.nama;
    chip.addEventListener("click", () => kirim(e.nama));
    chips.appendChild(chip);
  });

  /* ---------- Event ---------- */
  tombol.addEventListener("click", () => toggleChat());
  label.addEventListener("click", () => toggleChat(true));
  tutup.addEventListener("click", () => toggleChat(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleChat(false); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    kirim(input.value);
    input.value = "";
  });
})();