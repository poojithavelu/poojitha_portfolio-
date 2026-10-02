document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  const editToggle = document.getElementById('edit-toggle');
  const photoInput = document.getElementById('profile-photo-input');
  const portrait = document.querySelector('.portrait');
  const storageKey = 'poojithaPortfolioEdits';
  const photoStorageKey = 'poojithaProfilePhoto';

  const saveEdits = () => {
    const payload = {};
    document.querySelectorAll('[data-edit]').forEach((element) => {
      payload[element.dataset.edit] = element.innerText.trim();
    });
    localStorage.setItem(storageKey, JSON.stringify(payload));
  };

  const restoreEdits = () => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.entries(saved).forEach(([key, value]) => {
      const element = document.querySelector(`[data-edit="${key}"]`);
      if (element && typeof value === 'string') {
        element.innerText = value;
      }
    });
  };

  const applyProfilePhoto = (dataUrl) => {
    if (!portrait) return;
    portrait.style.backgroundImage = `linear-gradient(180deg, rgba(18, 26, 43, 0.08), rgba(18, 26, 43, 0.28)), url("${dataUrl}")`;
    localStorage.setItem(photoStorageKey, dataUrl);
  };

  const restoreProfilePhoto = () => {
    const savedPhoto = localStorage.getItem(photoStorageKey);
    if (savedPhoto && portrait) {
      portrait.style.backgroundImage = `linear-gradient(180deg, rgba(18, 26, 43, 0.08), rgba(18, 26, 43, 0.28)), url("${savedPhoto}")`;
    }
  };

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  restoreEdits();
  restoreProfilePhoto();

  if (photoInput && portrait) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          applyProfilePhoto(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (editToggle) {
    editToggle.addEventListener('click', () => {
      const isEditing = document.body.classList.toggle('edit-mode');
      document.querySelectorAll('[data-edit]').forEach((element) => {
        element.contentEditable = isEditing ? 'true' : 'false';
        element.classList.toggle('editable', isEditing);
        element.setAttribute('spellcheck', 'false');
      });

      editToggle.textContent = isEditing ? 'Save changes' : 'Edit portfolio';

      if (!isEditing) {
        saveEdits();
      }
    });
  }
});
