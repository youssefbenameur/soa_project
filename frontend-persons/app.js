// app.js ✅ (uses fixed backend URL)
(function () {
  const BASE_URL = "../api";

  const tbody = document.getElementById("personsTbody");
  const btnRefresh = document.getElementById("btnRefresh");
  const btnAdd = document.getElementById("btnAdd");

  const searchMode = document.getElementById("searchMode");
  const searchValue = document.getElementById("searchValue");
  const btnSearch = document.getElementById("btnSearch");
  const searchResult = document.getElementById("searchResult");

  const modalEl = document.getElementById("personModal");
  const modal = new bootstrap.Modal(modalEl);
  const personForm = document.getElementById("personForm");
  const modalTitle = document.getElementById("modalTitle");
  const personId = document.getElementById("personId");
  const personName = document.getElementById("personName");
  const personAge = document.getElementById("personAge");
  const btnSubmit = document.getElementById("btnSubmit");

  const toastEl = document.getElementById("appToast");
  const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  const toastBody = document.getElementById("toastBody");

  function showToast(message) {
    toastBody.textContent = message;
    toast.show();
  }

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    }[c]));
  }

  function renderRows(persons) {
    if (!Array.isArray(persons) || persons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-secondary py-4">Aucune personne.</td></tr>';
      return;
    }
    tbody.innerHTML = persons.map(p => `
      <tr>
        <td class="fw-semibold">${esc(p.id)}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.age)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="${esc(p.id)}">Modifier</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${esc(p.id)}">Supprimer</button>
        </td>
      </tr>
    `).join("");
  }

  async function loadAll() {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-secondary py-4">Chargement...</td></tr>';
    searchResult.classList.add("d-none");
    searchResult.innerHTML = "";
    try {
      const persons = await window.PersonApi.apiGetAll(BASE_URL);
      renderRows(persons);
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">${esc(e.message)}</td></tr>`;
      showToast("Erreur backend (URL/CORS/Tomcat).");
    }
  }

  function openAddModal() {
    modalTitle.textContent = "Ajouter une personne";
    btnSubmit.textContent = "Ajouter";
    personId.value = "";
    personName.value = "";
    personAge.value = "";
    personForm.classList.remove("was-validated");
    modal.show();
  }

  async function openEditModal(id) {
    modalTitle.textContent = "Modifier une personne";
    btnSubmit.textContent = "Enregistrer";
    personForm.classList.remove("was-validated");
    try {
      const res = await window.PersonApi.apiGetById(BASE_URL, id);
      const p = res?.data ?? res;
      if (!p) throw new Error("Personne introuvable");
      personId.value = p.id;
      personName.value = p.name ?? "";
      personAge.value = p.age ?? "";
      modal.show();
    } catch (e) {
      showToast(e.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm(`Supprimer la personne ID=${id} ?`)) return;
    try {
      await window.PersonApi.apiDelete(BASE_URL, id);
      showToast("Supprimé.");
      await loadAll();
    } catch (e) {
      showToast(e.message);
    }
  }

  async function handleSearch() {
    const mode = searchMode.value;
    const value = searchValue.value.trim();
    if (!value) return showToast("Entrez une valeur.");

    try {
      if (mode === "id") {
        const id = Number(value);
        if (!Number.isFinite(id)) throw new Error("ID invalide");
        const res = await window.PersonApi.apiGetById(BASE_URL, id);
        const p = res?.data ?? res;
        showResult(`Recherche ID=${id}`, p || null);
      } else {
        const res = await window.PersonApi.apiGetByName(BASE_URL, value);
        const p = res?.data ?? res;
        showResult(`Recherche nom="${value}"`, p || null);
      }
    } catch (e) {
      showToast(e.message);
    }
  }

  function showResult(title, person) {
    searchResult.classList.remove("d-none");
    if (!person) {
      searchResult.innerHTML = `<div class="alert alert-warning mb-0">${esc(title)} : aucun résultat.</div>`;
      return;
    }
    searchResult.innerHTML = `
      <div class="alert alert-success mb-0">
        <div class="fw-semibold mb-1">${esc(title)}</div>
        <div>ID: <b>${esc(person.id)}</b> — Nom: <b>${esc(person.name)}</b> — Âge: <b>${esc(person.age)}</b></div>
      </div>
    `;
  }

  btnRefresh.addEventListener("click", loadAll);
  btnAdd.addEventListener("click", openAddModal);
  btnSearch.addEventListener("click", handleSearch);
  searchValue.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSearch(); });

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = Number(btn.getAttribute("data-id"));
    if (!Number.isFinite(id)) return;
    if (action === "edit") return openEditModal(id);
    if (action === "delete") return handleDelete(id);
  });

  personForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    personForm.classList.add("was-validated");

    const id = personId.value ? Number(personId.value) : null;
    const name = personName.value.trim();
    const age = Number(personAge.value);

    if (!name || name.length < 2 || !Number.isFinite(age) || age < 1 || age > 150) return;

    try {
      if (!id) {
        await window.PersonApi.apiAdd(BASE_URL, age, name);
        showToast("Ajouté.");
      } else {
        await window.PersonApi.apiUpdate(BASE_URL, id, age, name);
        showToast("Modifié.");
      }
      modal.hide();
      await loadAll();
    } catch (err) {
      showToast(err.message);
    }
  });

  loadAll();
})();
