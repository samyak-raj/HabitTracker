import './homePage.css'
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

// Function to calculate completion rate
function calculateCompletionRate(habit) {
  if (!habit.progress || habit.progress.length === 0) return 0;
  const completed = habit.progress.filter(p => p.completed).length;
  return (completed / habit.progress.length) * 100;
}

// Function to sign out
function signOut() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.reload()
}

export default async function initializeHome() {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    window.location.reload()
    return
  }

  // Fetch user's habits
  const habits = await fetchHabits()

  document.getElementById('app').innerHTML = `
    <nav class="navbar">
      <div class="logo">HabitTracker</div>
      <div class="user-section">
        <span class="user-name">${user.username}</span>
        <button id="signout-btn" class="btn btn-primary">Sign Out</button>
      </div>
    </nav>
    <main class="home">
      <div class="welcome-section">
        <h1>Welcome, ${user.username || 'Habit Hero'}!</h1>
        <p>This is your habit dashboard.</p>
      </div>

      <div class="habits-section">
        <div class="habits-header">
          <h2>Your Habits</h2>
          <button id="add-habit-btn" class="add-habit-btn">
            <span class="plus-icon">+</span> Add New Habit
          </button>
        </div>

        <div class="habits-container">
          ${habits.length === 0 ? `
            <div class="no-habits">
              <p>You haven't added any habits yet.</p>
              <p>Click the "Add New Habit" button to get started!</p>
            </div>
          ` : `
            <div class="habits-grid">
              ${habits.map(habit => {
    const completionRate = calculateCompletionRate(habit);
    return `
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
                  <div class="progress-section">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${completionRate}%"></div>
                    </div>
                    <span class="completion-rate">${Math.round(completionRate)}% Complete</span>
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
              `}).join('')}
            </div>
          `}
        </div>
      </div>
    </main>
  `

  // Add event listeners
  document.getElementById('signout-btn').addEventListener('click', signOut)

  // Add event listeners for habit actions
  document.querySelectorAll('.complete-btn').forEach(button => {
    button.addEventListener('click', () => completeHabit(button.dataset.habitId))
  })

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => editHabit(button.dataset.habitId))
  })

  // Add event listener for the add habit button
  document.getElementById('add-habit-btn').addEventListener('click', () => {
    showAddHabitModal()
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
      window.location.reload()
    }
    return []
  }
}