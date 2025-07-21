import './dashboard.css'
import api from '../../api'
import { showAddHabitModal } from './addHabitModal'
import { editHabit, completeHabit, deleteHabit } from './habitActions'
import { showEditProfileModal } from './editProfileModal';
import { renderStatsSummary, fetchCurrentUser, updateDashboardStats, shouldResetStreak, fetchHabits } from './dashboardHelpers'

// Function to sign out
function signOut() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}

const backendBaseUrl = 'http://localhost:5000';

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

function setStatValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
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

async function renderHabitsPage(user) {
  // Fetch user's habits
  const habits = await fetchHabits();
  renderHabits(habits);
  // Add event listeners
  const signoutBtn = document.getElementById('signout-btn');
  if (signoutBtn) signoutBtn.addEventListener('click', signOut);
  const addHabitBtn = document.getElementById('add-habit-btn');
  if (addHabitBtn) addHabitBtn.addEventListener('click', () => {
    showAddHabitModal();
  });
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

// Remove DOMContentLoaded wrapper and attach event listeners directly
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

export { renderStatsSummary, updateDashboardStats, renderHabitsPage };