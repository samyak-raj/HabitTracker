import './dashboard.css'
import axios from 'axios'
import { showAddHabitModal } from './addHabitModal'
import { editHabit, completeHabit } from './habitActions'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Function to sign out
function signOut() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}

async function renderDashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    window.location.href = '/'
    return
  }
  // Fill in username and welcome
  document.getElementById('dashboard-username').textContent = user.username
  document.getElementById('dashboard-welcome').textContent = `Welcome, ${user.username || 'Habit Hero'}!`

  // Fetch user's habits
  const habits = await fetchHabits()
  renderHabits(habits)

  // Add event listeners
  document.getElementById('signout-btn').addEventListener('click', signOut)
  document.getElementById('add-habit-btn').addEventListener('click', () => {
    showAddHabitModal()
  })
}

function renderHabits(habits) {
  const container = document.getElementById('habits-container')
  if (!container) return
  if (habits.length === 0) {
    container.innerHTML = `
      <div class="no-habits">
        <p>You haven't added any habits yet.</p>
        <p>Click the "Add New Habit" button to get started!</p>
      </div>
    `
    return
  }
  container.innerHTML = `
    <div class="habits-grid">
      ${habits.map(habit => `
        <div class="habit-card ${habit.status}" data-habit-id="${habit._id}">
          <div class="habit-header">
            <h3>${habit.title}</h3>
            <span class="category-badge ${habit.category}">${habit.category}</span>
          </div>
          <p class="habit-description">${habit.description || 'No description provided'}</p>
          <div class="habit-stats">
            <span class="frequency">🔄 ${habit.frequency}</span>
            <span class="xp">⭐ ${habit.experiencePoints} XP</span>
          </div>
          <div class="habit-actions">
            <button class="btn btn-primary complete-btn" data-habit-id="${habit._id}">
                <i class="fas fa-check"></i> Complete
            </button>
            <button class="btn btn-secondary edit-btn" data-habit-id="${habit._id}">
                <i class="fas fa-edit"></i> Edit
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `
  // Add event listeners for habit actions
  container.querySelectorAll('.complete-btn').forEach(button => {
    button.addEventListener('click', () => completeHabit(button.dataset.habitId))
  })
  container.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => editHabit(button.dataset.habitId))
  })
}

// Function to fetch habits from the backend
async function fetchHabits() {
  try {
    const response = await api.get('/habits/user')
    return response.data
  } catch (error) {
    console.error('Error fetching habits:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return []
  }
}

// Initialize dashboard on page load
renderDashboard()