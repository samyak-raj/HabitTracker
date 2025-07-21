import api from '../../api'
import { showEditHabitModal } from './editHabitModal'
import { showDeleteConfirmationModal } from './deleteConfirmationModal'
import { renderStatsSummary } from './dashboard'
import { updateDashboardStats } from './dashboard'

// Function to handle habit editing
export const editHabit = async (habitId) => {
    try {
        const response = await api.get(`/habits/${habitId}`)
        showEditHabitModal(response.data)
    } catch (error) {
        console.error('Error fetching habit:', error.response?.data || error.message)
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            window.location.reload()
        } else {
            alert('Failed to fetch habit details. Please try again.')
        }
    }
}

// Function to handle habit deletion
export const deleteHabit = (habitId) => {
    const performDelete = async () => {
        try {
            const habitCard = document.querySelector(`.habit-card[data-habit-id="${habitId}"]`);
            if (!habitCard) return;

            await api.delete(`/habits/${habitId}`);

            habitCard.classList.add('fade-out-and-remove');
            habitCard.addEventListener('transitionend', () => {
                habitCard.remove();
            });
        } catch (error) {
            console.error('Error deleting habit:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.reload();
            } else {
                alert('Failed to delete habit. Please try again.');
            }
        }
    };

    showDeleteConfirmationModal(habitId, performDelete);
};

// Function to handle habit completion
export const completeHabit = async (habitId) => {
    try {
        const habitCard = document.querySelector(`.habit-card[data-habit-id="${habitId}"]`);
        if (!habitCard) return;

        // Call the API to complete the habit
        const response = await api.post(`/habits/${habitId}/complete`);
        const updatedUser = response.data.user;
        const streak = response.data.streak;

        // Add a fade-out effect, then remove the card
        habitCard.classList.add('fade-out-and-remove');
        habitCard.addEventListener('transitionend', () => {
            habitCard.remove();
        });

        // Update user stats in the UI
        if (updatedUser) {
            renderStatsSummary(updatedUser);
        }
        await updateDashboardStats();

        // Show streak and XP bonus message
        if (streak) {
            alert(`Streak: ${streak.currentStreak} days!\nXP Gained: ${streak.xpGained} (Bonus applied)`);
        }
    } catch (error) {
        console.error('Error completing habit:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.reload();
        } else {
            alert('Failed to complete habit. Please try again.');
        }
    }
}; 