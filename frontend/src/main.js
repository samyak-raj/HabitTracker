import initializeLanding from './components/landingPage/landing'

// Only show landing page for /
if (window.location.pathname === '/') {
  if (localStorage.getItem('authToken') && localStorage.getItem('user')) {
    window.location.href = '/dashboard.html';
  } else {
    initializeLanding()
  }
}