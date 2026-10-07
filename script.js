/* ==========================================================
   Formulir Pendaftaran Ekstrakurikuler 2026/2027
   Validasi form + notifikasi sukses.
   Logika chatbot ada di js/chatbot.js
   ========================================================== */
(function () {
  "use strict";

  const form       = document.getElementById("registrationForm");
  const popup      = document.getElementById("successPopup");
  const closePopup = document.getElementById("closePopup");

  /* ---------- Aturan validasi ----------
     Setiap fungsi mengembalikan pesan error, atau "" jika valid. */
  const aturan = {
    nama: v =>
      !v ? "Nama lengkap tidak boleh kosong." :
      v.length < 3 ? "Nama minimal 3 karakter." : "",

    nis: v =>
      !v ? "NIS tidak boleh kosong." :
      !/^\d{4,12}$/.test(v) ? "NIS harus berupa angka (4–12 digit)." : "",

    kelas: v => (v ? "" : "Silakan pilih kelas."),

    ekstrakurikuler: v => (v ? "" : "Silakan pilih ekstrakurikuler."),

    nomorHp: v => {
      if (!v) return "Nomor HP tidak boleh kosong.";
      const bersih = v.replace(/[\s-]/g, "");
      return /^(\+62|62|0)8\d{8,11}$/.test(bersih) ? "" : "Masukkan nomor HP yang valid, mis. 081234567890.";
    },

    email: v =>
      !v ? "Email tidak boleh kosong." :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Masukkan email yang valid." : ""
  };

  /* ---------- Tampilan status ---------- */
  function validasi(field) {
    const pesan   = aturan[field.name](field.value.trim());
    const wrapper = field.closest(".input-wrapper");
    const error   = field.closest(".form-group").querySelector(".error-message");

    wrapper.classList.toggle("invalid", Boolean(pesan));
    wrapper.classList.toggle("valid", !pesan);
    error.textContent = pesan;
    return !pesan;
  }

  function resetStatus() {
    form.querySelectorAll(".input-wrapper").forEach(w => w.classList.remove("valid", "invalid"));
    form.querySelectorAll(".error-message").forEach(e => (e.textContent = ""));
  }

  /* ---------- Notifikasi ---------- */
  let timerPopup;
  function tampilkanPopup() {
    popup.classList.add("show");
    clearTimeout(timerPopup);
    timerPopup = setTimeout(() => popup.classList.remove("show"), 5000);
  }

  /* ---------- Event ---------- */
  const fields = Array.from(form.querySelectorAll("input, select"));

  fields.forEach(field => {
    field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => validasi(field));
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    // Validasi semua field (tanpa berhenti di yang pertama gagal)
    const hasil = fields.map(validasi);
    if (hasil.every(Boolean)) {
      tampilkanPopup();
      form.reset();
      resetStatus();
    } else {
      fields[hasil.indexOf(false)].focus();
    }
  });

  closePopup.addEventListener("click", () => popup.classList.remove("show"));
})();