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

const renderPets = (pets) => {
    const petsContainer = document.getElementById('pets-container');
    petsContainer.innerHTML = ''; // Clear existing pets

    if (pets.length === 0) {
        petsContainer.innerHTML = '<p>You don\'t own any pets yet. Visit the shop to buy one!</p>';
        return;
    }

    pets.forEach(pet => {
        const petItem = document.createElement('div');
        petItem.classList.add('pet-item');

        petItem.innerHTML = `
            <h3>${pet.name}</h3>
            <img src="${pet.image}" alt="${pet.name}" class="pet-image">
            <p>${pet.description}</p>
        `;

        petsContainer.appendChild(petItem);
    });
};

const redirectToLogin = () => {
    window.location.href = '/';
};

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    if (!user) {
        redirectToLogin();
    } else {
        renderPets(user.pets);
    }

    const signoutBtn = document.getElementById('signout-btn');
    signoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        redirectToLogin();
    });
});

const hamburger = document.getElementById('navbar-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const signOutBtnMobile = document.getElementById('signout-btn-mobile');

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
if (signOutBtnMobile) {
  signOutBtnMobile.addEventListener('click', signOut);
}
function signOut() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  redirectToLogin();
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileMenu) {
    mobileMenu.setAttribute('hidden', '');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
