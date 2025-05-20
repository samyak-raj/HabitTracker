import { Clerk } from '@clerk/clerk-js'
import './style.css'
import initializeLanding from './components/landingPage/landing'
import initializeHome from './components/homePage/homePage'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerk = new Clerk(clerkPubKey)

// Function to handle authentication state
const handleAuthState = async () => {
  try {
    await clerk.load()

    if (clerk.user) {
      initializeHome(clerk)
    } else {
      // Redirect to landing page if not authenticated
        initializeLanding(clerk)
      
    }
  } catch (error) {
    console.error('Authentication error:', error)
    window.location.href = '/'
  }
}

// Initialize the app
handleAuthState()

// Listen for authentication state changes
clerk.addListener(({ user }) => {
  handleAuthState()
})