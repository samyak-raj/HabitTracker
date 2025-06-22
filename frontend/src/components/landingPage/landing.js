import './landing.css'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_BASE_URL = 'http://localhost:5000/api'

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
    const result = await fetch(`${API_BASE_URL}/users/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: response.credential })
    })

    if (!result.ok) {
      throw new Error('Authentication failed')
    }

    const data = await result.json()

    // Store authentication data
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Reload the page to show the home page
    window.location.reload()
  } catch (error) {
    console.error('Sign in error:', error)
    alert('Sign in failed. Please try again.')
  }
}

export default function initializeLanding() {
  document.getElementById('app').innerHTML = `
    <nav class="navbar">
      <div class="logo">HabitTracker</div>
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
        <p class="subtitle">Track your habits, build streaks, and transform your life with our simple and effective habit tracking system.</p>
        <div class="google-btn-wrapper">
          <button class="btn btn-primary btn-large">Get Started</button>
          <div id="get-started-hero-btn"></div>
        </div>
      </div>
      <div class="hero-image">
        <div class="feature-grid">
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <h3>Track Progress</h3>
            <p>Monitor your daily habits and see your progress over time</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔥</span>
            <h3>Build Streaks</h3>
            <p>Maintain your momentum with streak tracking</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <h3>Set Goals</h3>
            <p>Define clear goals and track your achievements</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <h3>Stay Motivated</h3>
            <p>Get reminders and stay on track with your habits</p>
          </div>
        </div>
      </div>
    </main>
  `

  // Initialize Google OAuth
  initializeGoogleOAuth()
}


