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

const getPets = async () => {
    try {
        const response = await api.get('/pets');
        return response.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        return [];
    }
};

const renderPets = (pets, user) => {
    const shopContainer = document.getElementById('shop-container');
    shopContainer.innerHTML = ''; // Clear existing pets

    if (pets.length === 0) {
        shopContainer.innerHTML = '<p>No pets available in the shop right now.</p>';
        return;
    }

    pets.forEach(pet => {
        const petItem = document.createElement('div');
        petItem.classList.add('pet-item');

        const isOwned = user.pets.includes(pet._id);

        petItem.innerHTML = `
            <h3>${pet.name}</h3>
            <img src="${pet.image}" alt="${pet.name}" class="pet-image">
            <p>${pet.description}</p>
            <div class="pet-footer">
                <p class="pet-cost">Cost: &#128178 ${pet.cost}</p>
                <button class="btn ${isOwned ? 'btn-disabled' : 'btn-primary'}" data-pet-id="${pet._id}" ${isOwned ? 'disabled' : ''}>
                    ${isOwned ? 'Owned' : 'Buy'}
                </button>
            </div>
        `;

        shopContainer.appendChild(petItem);
    });
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

const buyPet = async (petId) => {
    try {
        const response = await api.post('/pets/buy', { petId });
        return response.data;
    } catch (error) {
        console.error('Error buying pet:', error);
        alert(error.response.data.message);
        return null;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    if (!user) {
        redirectToLogin();
    }

    const coins = await getUserCoins();
    const coinCount = document.getElementById('coin-count');
    coinCount.textContent = coins.coins;

    const pets = await getPets();
    renderPets(pets, user);

    const shopContainer = document.getElementById('shop-container');
    shopContainer.addEventListener('click', async (e) => {
        if (e.target.matches('.btn-primary')) {
            const petId = e.target.dataset.petId;
            const result = await buyPet(petId);
            if (result) {
                const updatedUser = await getUser();
                const updatedCoins = await getUserCoins();
                coinCount.textContent = updatedCoins.coins;
                renderPets(pets, updatedUser);
            }
        }
    });

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

    const hamburger = document.getElementById('navbar-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = !mobileMenu.hasAttribute('hidden');
            if (isOpen) {
                mobileMenu.setAttribute('hidden', '');
                hamburger.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.removeAttribute('hidden');
                hamburger.setAttribute('aria-expanded', 'true');
            }
        });
    }
});
