import './dashboard.css'
import axios from 'axios'
import { showAddHabitModal } from './addHabitModal'
import { editHabit, completeHabit, deleteHabit } from './habitActions'
import { showEditProfileModal } from './editProfileModal';

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

const backendBaseUrl = 'http://localhost:5000';

function renderStatsSummary(user) {
  // Update profile information
  const userNameEl = document.getElementById('user-name');
  const userLevelEl = document.getElementById('user-level');
  const currentXpEl = document.getElementById('current-xp');
  const nextLevelXpEl = document.getElementById('next-level-xp');
  const experienceFillEl = document.getElementById('experience-fill');
  const profileImg = document.getElementById('user-profile-pic');

  if (userNameEl) userNameEl.textContent = user.username || 'Habit Hero';

  // Set profile picture from database
  if (profileImg && user.profilePicture) {
    const picUrl = user.profilePicture.startsWith('http')
      ? user.profilePicture
      : backendBaseUrl + user.profilePicture;
    profileImg.onerror = function () {
      console.error('Failed to load profile picture:', picUrl);
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFMkU4RjAiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDEwNUMyMCA5NS4wNTc2IDI4LjA1NzYgODcgMzggODdIODJDNzEuOTQyNCA4NyA2NCA5NS4wNTc2IDY0IDEwNVYxMTVIMjBWMTEwNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
    };
    profileImg.src = picUrl;
  }

  // Use level and experience from database
  const level = user.level || 1;
  const experience = user.experience || 0;
  const experienceToNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));

  if (userLevelEl) userLevelEl.textContent = level;
  if (currentXpEl) currentXpEl.textContent = experience;
  if (nextLevelXpEl) nextLevelXpEl.textContent = experienceToNextLevel;
  if (experienceFillEl) {
    const experiencePercentage = (experience / experienceToNextLevel) * 100;
    experienceFillEl.style.width = `${experiencePercentage}%`;
  }
  // Update localStorage with latest user data
  localStorage.setItem('user', JSON.stringify(user));
}

async function fetchCurrentUser() {
  try {
    const response = await api.get('/users/me')
    return response.data
  } catch (error) {
    console.error('Error fetching current user:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return null
  }
}

async function renderHabitsPage(user) {
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
            <span class="difficulty">🎯 ${habit.difficulty.charAt(0).toUpperCase() + habit.difficulty.slice(1)}</span>
            <span class="xp">⭐ ${habit.experiencePoints} XP</span>
          </div>
          <div class="habit-actions">
            <button class="btn btn-primary complete-btn" data-habit-id="${habit._id}">
                <i class="fas fa-check"></i> Complete
            </button>
            <button class="btn btn-secondary edit-btn" data-habit-id="${habit._id}">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger delete-btn" data-habit-id="${habit._id}">
                <i class="fas fa-trash"></i> Delete
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
  container.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => deleteHabit(button.dataset.habitId))
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

function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Function to update dashboard stats (streaks and pending tasks)
async function updateDashboardStats() {
  try {
    // Fetch user for streaks
    const userResponse = await api.get('/users/me');
    const user = userResponse.data;
    // Fetch habits for pending tasks
    const habits = await fetchHabits();
    let pendingTasks = 0;
    habits.forEach(habit => {
      if (habit.status === 'active') pendingTasks += 1;
    });
    setStatValue('current-streak', user.currentStreak || 0);
    setStatValue('longest-streak', user.longestStreak || 0);
    setStatValue('pending-tasks', pendingTasks);
  } catch (err) {
    setStatValue('current-streak', 0);
    setStatValue('longest-streak', 0);
    setStatValue('pending-tasks', 0);
  }
}

// Add this after user/profile rendering logic
function openEditProfileModal(user) {
  showEditProfileModal({
    username: user.username,
    profilePicture: user.profilePicture,
    onUpdate: async ({ username, profilePictureFile }) => {
      try {
        const formData = new FormData();
        formData.append('username', username);
        if (profilePictureFile) {
          formData.append('profilePicture', profilePictureFile);
        }
        // Use axios directly for multipart
        const response = await api.put('/users/me', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const updatedUser = response.data;
        renderStatsSummary(updatedUser);
        // Optionally show a success message
        alert('Profile updated!');
      } catch (err) {
        alert('Failed to update profile.');
      }
    },
    onCancel: () => { }
  });
}

// Attach event listener after DOM/user is ready
function attachEditProfileBtn(user) {
  const btn = document.getElementById('edit-profile-btn');
  if (btn) {
    btn.onclick = () => openEditProfileModal(user);
  }
}

// Initialize logic based on page
let user = null;
try {
  const userData = localStorage.getItem('user');
  if (userData) {
    user = JSON.parse(userData);
  }
} catch (error) {
  console.error('Error parsing user data from localStorage:', error);
  // Clear corrupted data
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
}

if (!user) {
  window.location.href = '/'
} else {
  if (location.pathname.endsWith('dashboard.html')) {
    // Fetch fresh user data from database
    const currentUser = await fetchCurrentUser()
    if (currentUser) {
      renderStatsSummary(currentUser)
      attachEditProfileBtn(currentUser)
    } else {
      renderStatsSummary(user) // Fallback to localStorage data
      attachEditProfileBtn(user)
    }
    await updateDashboardStats();
    document.getElementById('signout-btn').addEventListener('click', signOut)
  } else if (location.pathname.endsWith('habits.html')) {
    renderHabitsPage(user)
    // Add a listener for when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        renderHabitsPage(user)
      }
    })
  }
}

// Hamburger menu logic for mobile
const hamburger = document.getElementById('navbar-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const signOutBtnMobile = document.getElementById('signout-btn-mobile');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.hasAttribute('hidden');
    if (isOpen) {
      mobileMenu.setAttribute('hidden', '');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.removeAttribute('hidden');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });
}
if (signOutBtnMobile) {
  signOutBtnMobile.addEventListener('click', signOut);
}
// Optional: Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileMenu) {
    mobileMenu.setAttribute('hidden', '');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

export { renderStatsSummary, updateDashboardStats };