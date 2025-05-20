import './landing.css'


export default async function initializeLanding(clerk) {
    await clerk.load()

    document.getElementById('app').innerHTML = `
        <nav class="navbar">
            <div class="logo">HabitTracker</div>
            <div class="auth-buttons">
                <button id="sign-in-btn" class="btn btn-outline">Sign In</button>
                <button id="sign-up-btn" class="btn btn-primary">Sign Up</button>
            </div>
        </nav>

        <main class="hero">
            <div class="hero-content">
                <h1>Build Better Habits,<br>One Day at a Time</h1>
                <p class="subtitle">Track your habits, build streaks, and transform your life with our simple and effective habit tracking system.</p>
                <button id="get-started-btn" class="btn btn-primary btn-large">Get Started</button>
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

    // Button handling
    const signInBtn = document.getElementById('sign-in-btn')
    const signUpBtn = document.getElementById('sign-up-btn')
    const getStartedBtn = document.getElementById('get-started-btn')

    // Show sign in
    signInBtn.addEventListener('click', () => {
        clerk.openSignIn()
    })

    // Show sign up
    signUpBtn.addEventListener('click', () => {
        clerk.openSignUp()
    })

    // Get started button also shows sign up
    getStartedBtn.addEventListener('click', () => {
        clerk.openSignUp()
    })
}


