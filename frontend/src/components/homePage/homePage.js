import './homePage.css'

export default async function initializeHome(clerk) {
  await clerk.load()

  if (!clerk.user) {
    location.reload()
    return
  }
  const imgUrl = clerk.user.imageUrl 
  document.getElementById('app').innerHTML = `
    <nav class="navbar">
      <div class="logo">HabitTracker</div>
      <div id="user-button"></div>
    </nav>
    <main class="home">
      <h1>Welcome, ${clerk.user.usename || clerk.user.username}!</h1>
      <p>This is your habit dashboard.</p>
    </main>
  `
  const userButton = document.getElementById("user-button")
  clerk.mountUserButton(userButton, {showName: true})
}
