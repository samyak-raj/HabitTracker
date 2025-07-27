import { getUser } from './api.js';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const getUserCoins = async () => {
    try {
        const response = await api.get('/users/coins');
        return response.data;
    } catch (error) {
        console.error('Error fetching user coins:', error);
        return null;
    }
};

const redirectToLogin = () => {
    window.location.href = '/';
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    if (!user) {
        redirectToLogin();
    }

    const coins = await getUserCoins();
    const coinCount = document.getElementById('coin-count');
    coinCount.textContent = coins.coins;

    const signoutBtn = document.getElementById('signout-btn');
    signoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        redirectToLogin();
    });

    const signoutBtnMobile = document.getElementById('signout-btn-mobile');
    signoutBtnMobile.addEventListener('click', () => {
        localStorage.removeItem('token');
        redirectToLogin();
    });
});
