import './style.css'
import initializeLanding from './components/landingPage/landing'

// Only show landing page for /
if (window.location.pathname === '/') {
  initializeLanding()
}