import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSetting } from './updateSetting';
import { bookTour } from './stripe';
//DOM
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const saveUpdateSettingBtn = document.querySelector('.btn--saveUpdate');
const updateSettingForm = document.querySelector('.form-user-data');
const saveUpdatePasswordBtn = document.querySelector('.btn--savepass');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
//Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

if (updateSettingForm) {
  updateSettingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    saveUpdateSettingBtn.textContent = 'Updating ...';

    await updateSetting(form, 'Data');
    window.setTimeout(() => {
      saveUpdateSettingBtn.textContent = 'Save settings';
      location.reload(true);
    }, 2000);
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveUpdatePasswordBtn.textContent = 'Updating ...';
    const data = {
      passwordCurrent: document.getElementById('password-current').value,
      password: document.getElementById('password').value,
      passwordConfirm: document.getElementById('password-confirm').value,
    };
    await updateSetting(data, 'Password');
    saveUpdatePasswordBtn.textContent = 'Save password';
    document.getElementById('password-confirm').blur();
    document.getElementById('password').blur();
    document.getElementById('password-current').blur();
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
