import './addHabitModal.css' // Reusing styles for consistency

export function showDeleteConfirmationModal(habitId, onConfirm) {
  const modalContainer = document.createElement('div')
  modalContainer.className = 'modal-container'
  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Confirm Deletion</h2>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete this habit? This action cannot be undone.</p>
      </div>
      <div class="modal-actions">
        <button class="cancel-btn">Cancel</button>
        <button class="confirm-delete-btn">Delete</button>
      </div>
    </div>
  `

  document.body.appendChild(modalContainer)

  const closeBtn = modalContainer.querySelector('.close-btn')
  const cancelBtn = modalContainer.querySelector('.cancel-btn')
  const confirmBtn = modalContainer.querySelector('.confirm-delete-btn')

  const closeModal = () => {
    modalContainer.classList.add('fade-out')
    setTimeout(() => {
      if (document.body.contains(modalContainer)) {
        document.body.removeChild(modalContainer)
      }
    }, 300)
  }

  closeBtn.addEventListener('click', closeModal)
  cancelBtn.addEventListener('click', closeModal)
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal()
    }
  })

  confirmBtn.addEventListener('click', () => {
    onConfirm(habitId)
    closeModal()
  })

  requestAnimationFrame(() => {
    modalContainer.classList.add('fade-in')
  })
} 