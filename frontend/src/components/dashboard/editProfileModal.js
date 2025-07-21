import api from '../../api'
export function showEditProfileModal({ username, profilePicture, onUpdate, onCancel }) {
  // Remove any existing modal
  const existing = document.getElementById('edit-profile-modal');
  if (existing) existing.remove();

  const backendBaseUrl = 'http://localhost:5000';

  // Ensure correct profile picture URL
  const picUrl = profilePicture && !profilePicture.startsWith('http')
    ? backendBaseUrl + profilePicture
    : profilePicture || '';

  // Modal HTML
  const modal = document.createElement('div');
  modal.id = 'edit-profile-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.4)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  modal.innerHTML = `
    <div style="background: #fff; border-radius: 12px; padding: 2rem; min-width: 320px; max-width: 90vw; box-shadow: 0 4px 24px rgba(0,0,0,0.15); position: relative;">
      <h2 style="margin-bottom: 1rem;">Edit Profile</h2>
      <form id="edit-profile-form">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <img id="edit-profile-pic-preview" src="${picUrl}" alt="Profile Picture" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
          <input type="file" id="edit-profile-pic-input" accept="image/*" style="margin-bottom: 1rem;" />
          <input type="text" id="edit-username-input" value="${username || ''}" placeholder="Username" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #cbd5e1; width: 100%;" required />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
          <button type="button" id="edit-profile-cancel-btn" style="padding: 0.5rem 1.2rem; border-radius: 6px; border: none; background: #e2e8f0; color: #334155; cursor: pointer;">Cancel</button>
          <button type="submit" style="padding: 0.5rem 1.2rem; border-radius: 6px; border: none; background: #2563eb; color: #fff; cursor: pointer;">Update</button>
        </div>
      </form>
    </div>
  `;

  // Add to DOM
  document.getElementById('edit-profile-modal-root').appendChild(modal);

  // Handle file preview
  const fileInput = modal.querySelector('#edit-profile-pic-input');
  const previewImg = modal.querySelector('#edit-profile-pic-preview');
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle cancel
  modal.querySelector('#edit-profile-cancel-btn').onclick = () => {
    modal.remove();
    if (onCancel) onCancel();
  };

  // Handle submit
  modal.querySelector('#edit-profile-form').onsubmit = (e) => {
    e.preventDefault();
    const newUsername = modal.querySelector('#edit-username-input').value.trim();
    const newPicFile = fileInput.files[0] || null;
    if (onUpdate) onUpdate({ username: newUsername, profilePictureFile: newPicFile });
    modal.remove();
  };
} 