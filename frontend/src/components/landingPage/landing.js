import './landing.css'
import api from '../../api'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Initialize Google OAuth
function initializeGoogleOAuth() {
  if (typeof google === 'undefined') {
    // Load Google OAuth script if not already loaded
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn
      })
      // Navbar button
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      )
      // Hero button
      google.accounts.id.renderButton(
        document.getElementById('get-started-hero-btn'),
        { theme: 'filled_blue', size: 'large', text: 'continue_with' }
      )
    }
    document.head.appendChild(script)
  } else {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn
    })
    // Navbar button
    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    )
    // Hero button
    google.accounts.id.renderButton(
      document.getElementById('get-started-hero-btn'),
      { theme: 'filled_blue', size: 'large', text: 'continue_with' }
    )
  }
}

// Handle Google sign in
async function handleGoogleSignIn(response) {
  try {
    const result = await api.post('/users/auth/google', {
      token: response.credential
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = result.data

    // Store authentication data
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Redirect to dashboard
    window.location.href = '/dashboard.html'
  } catch (error) {
    console.error('Sign in error:', error)
    alert('Sign in failed. Please try again.')
  }
}

export default function initializeLanding() {
  document.getElementById('app').innerHTML = `
    <nav class="navbar">
      <div class="logo">HabitHero</div>
      <div class="auth-buttons">
        <div class="google-btn-wrapper">
          <button class="btn btn-primary">Sign in with Google</button>
          <div id="google-signin-btn"></div>
        </div>
      </div>
    </nav>
    <main class="hero">
      <div class="hero-content">
        <h1>Build Better Habits,<br>One Day at a Time</h1>
        <p class="subtitle">Track, gamify, and level up your daily routines with HabitHero.</p>
        <div class="google-btn-wrapper">
          <button class="btn btn-primary btn-large">Get Started</button>
          <div id="get-started-hero-btn"></div>
        </div>
      </div>
      <div class="hero-image">
        <div class="feature-grid">
          <div class="feature-item">
            <span class="feature-icon">⭐</span>
            <h3>XP & Leveling</h3>
            <p>Earn experience points for every habit you complete and level up as you grow!</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔥</span>
            <h3>Streaks</h3>
            <p>Build and maintain streaks to stay motivated and consistent every day.</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🦸‍♂️</span>
            <h3>Profile & Avatar</h3>
            <p>Personalize your profile, upload an avatar, and show off your progress.</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔐</span>
            <h3>Google Sign-In</h3>
            <p>Sign up or log in instantly and securely with your Google account.</p>
          </div>
        </div>
      </div>
    </main>
  `;
  initializeGoogleOAuth();
}



