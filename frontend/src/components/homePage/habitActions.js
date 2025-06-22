import axios from 'axios'
import { showEditHabitModal } from './editHabitModal'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

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

// Function to handle habit completion
export const completeHabit = async (habitId) => {
    try {
        // First get the habit to check its current state
        const habitResponse = await api.get(`/habits/${habitId}`)
        const habit = habitResponse.data
        const today = new Date().toISOString().split('T')[0]

        // Check if habit is already completed for today
        const todayProgress = habit.progress.find(p =>
            new Date(p.date).toISOString().split('T')[0] === today
        )

        if (todayProgress && todayProgress.completed) {
            alert('You have already completed this habit today!')
            return
        }

        // Complete the habit for today
        await api.post(`/habits/${habitId}/complete`, {
            date: new Date(),
            value: 1, // Assuming 1 represents completion
            notes: 'Completed via UI'
        })

        // Refresh the page to show updated data
        location.reload()
    } catch (error) {
        console.error('Error completing habit:', error.response?.data || error.message)
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            window.location.reload()
        } else {
            alert('Failed to complete habit. Please try again.')
        }
    }
} 