import './style.css'
import initializeLanding from './components/landingPage/landing'
import initializeHome from './components/homePage/homePage'

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  return !!token
}

// Function to handle authentication state
const handleAuthState = async () => {
  try {
    if (isAuthenticated()) {
      initializeHome()
    } else {
      initializeLanding()
    }
  } catch (error) {
    console.error('Authentication error:', error)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    window.location.href = '/'
  }
}

// Initialize the app
handleAuthState()

// Listen for authentication state changes
window.addEventListener('storage', (e) => {
  if (e.key === 'authToken') {
    handleAuthState()
  }
})