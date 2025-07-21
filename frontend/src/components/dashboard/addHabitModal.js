import api from '../../api'
import './addHabitModal.css'

export function showAddHabitModal() {
    const modalContainer = document.createElement('div')
    modalContainer.className = 'modal-container'
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Habit</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form id="add-habit-form">
                <div class="form-group">
                    <label for="habit-title">Habit Title</label>
                    <input type="text" id="habit-title" name="title" required 
                           placeholder="e.g., Daily Meditation">
                </div>
                
                <div class="form-group">
                    <label for="habit-description">Description</label>
                    <textarea id="habit-description" name="description" 
                              placeholder="Describe your habit..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="habit-category">Category</label>
                    <select id="habit-category" name="category" required>
                        <option value="health">Health</option>
                        <option value="fitness">Fitness</option>
                        <option value="learning">Learning</option>
                        <option value="productivity">Productivity</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="other" selected>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="habit-difficulty">Difficulty</label>
                    <select id="habit-difficulty" name="difficulty" required>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Create Habit</button>
                </div>
            </form>
        </div>
    `

    document.body.appendChild(modalContainer)

    const closeBtn = modalContainer.querySelector('.close-btn')
    const cancelBtn = modalContainer.querySelector('.cancel-btn')
    const form = modalContainer.querySelector('#add-habit-form')

    const closeModal = () => {
        modalContainer.classList.add('fade-out')
        setTimeout(() => {
            document.body.removeChild(modalContainer)
        }, 300)
    }

    closeBtn.addEventListener('click', closeModal)
    cancelBtn.addEventListener('click', closeModal)

    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal()
        }
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = {
            title: form.querySelector('#habit-title').value,
            description: form.querySelector('#habit-description').value,
            category: form.querySelector('#habit-category').value,
            difficulty: form.querySelector('#habit-difficulty').value
        }

        try {
            await api.post('/habits', formData)

            const successMessage = document.createElement('div')
            successMessage.className = 'success-message'
            successMessage.textContent = 'Habit created successfully!'
            modalContainer.querySelector('.modal-content').prepend(successMessage)

            setTimeout(() => {
                closeModal()
                location.reload()
            }, 500)

        } catch (error) {
            console.error('Error creating habit:', error.response?.data || error.message)

            if (error.response?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')
                window.location.reload()
                return
            }

            const errorMessage = document.createElement('div')
            errorMessage.className = 'error-message'
            errorMessage.textContent = 'Failed to create habit. Please try again.'
            modalContainer.querySelector('.modal-content').prepend(errorMessage)

            setTimeout(() => {
                errorMessage.remove()
            }, 3000)
        }
    })

    requestAnimationFrame(() => {
        modalContainer.classList.add('fade-in')
    })
} 