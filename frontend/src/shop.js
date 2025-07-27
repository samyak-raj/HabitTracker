import api from './api.js';

const getUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

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
