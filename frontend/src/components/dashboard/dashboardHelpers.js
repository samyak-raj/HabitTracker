import api from '../../api';

const backendBaseUrl = 'http://localhost:5000';

export function renderStatsSummary(user) {
    const userNameEl = document.getElementById('user-name');
    const userLevelEl = document.getElementById('user-level');
    const currentXpEl = document.getElementById('current-xp');
    const nextLevelXpEl = document.getElementById('next-level-xp');
    const experienceFillEl = document.getElementById('experience-fill');
    const profileImg = document.getElementById('user-profile-pic');

    if (userNameEl) userNameEl.textContent = user.username || 'Habit Hero';

    if (profileImg && user.profilePicture) {
        let picUrl = user.profilePicture;
        if (picUrl.startsWith('http://') || picUrl.startsWith('https://')) {
            // Google or external image
            profileImg.src = picUrl;
        } else if (picUrl.startsWith('/profile-pics/')) {
            // Local upload
            profileImg.src = backendBaseUrl + picUrl;
        } else {
            // Fallback to default
            profileImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFMkU4RjAiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDEwNUMyMCA5NS4wNTc2IDI4LjA1NzYgODcgMzggODdIODJDNzEuOTQyNCA4NyA2NCA5NS4wNTc2IDY0IDEwNVYxMTVIMjBWMTEwNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
        }
        profileImg.onerror = function () {
            console.error('Failed to load profile picture:', picUrl, user.profilePicture);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFMkU4RjAiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDEwNUMyMCA5NS4wNTc2IDI4LjA1NzYgODcgMzggODdIODJDNzEuOTQyNCA4NyA2NCA5NS4wNTc2IDY0IDEwNVYxMTVIMjBWMTEwNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
        };
    }

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
    localStorage.setItem('user', JSON.stringify(user));
}

export async function fetchCurrentUser() {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return null;
    }
}

export async function updateDashboardStats() {
    try {
        const userResponse = await api.get('/users/me');
        let user = userResponse.data;
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

function setStatValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

export function shouldResetStreak(user) {
    if (!user.lastCompletedDate) return true;
    const last = new Date(user.lastCompletedDate);
    last.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return (
        last.getTime() !== today.getTime() &&
        last.getTime() !== yesterday.getTime()
    );
}

// Helper for dashboard.js to fetch habits
export async function fetchHabits() {
    try {
        const response = await api.get('/habits/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching habits:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return [];
    }
} 