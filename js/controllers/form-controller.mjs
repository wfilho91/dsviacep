import Address from '../models/address.mjs';
import * as addressService from '../services/address-service.mjs';
import * as listController from './list-controller.mjs';

function State() {
  this.address = new Address();

  this.btnSave = null;
  this.btnClear = null;

  this.inputCep = null;
  this.inputStreet = null;
  this.inputNumber = null;
  this.inputCity = null;

  this.errorCep = null;
  this.errorNumber = null;
}

const state = new State();

export function init() {
  // inputs
  state.inputCep = document.forms.newAddress.cep;
  state.inputStreet = document.forms.newAddress.street;
  state.inputNumber = document.forms.newAddress.number;
  state.inputCity = document.forms.newAddress.city;

  //btn
  state.btnSave = document.forms.newAddress.btnSave;
  state.btnClear = document.forms.newAddress.btnClear;

  //errors
  state.errorCep = document.querySelector('[data-error="cep"]');
  state.errorNumber = document.querySelector('[data-error="number"]');

  // input  events
  state.inputNumber.addEventListener('change', handleInputNumberChange);
  state.inputNumber.addEventListener('keyup', handleInputNumberKeyup);
  state.inputCep.addEventListener('change', handleInputCepChange);

  //btn events
  state.btnClear.addEventListener('click', handleBtnClearClick);
  state.btnSave.addEventListener('click', handleBtnSaveClick);
}

// handle functions

function handleInputNumberChange(event) {
  if (event.target.value == '') {
    setFormError('number', 'Campo requerido');
  } else {
    setFormError('number', '');
  }
}

function handleBtnClearClick(event) {
  event.preventDefault();
  clearForm();
}

function handleBtnSaveClick(event) {
  event.preventDefault();

  const errors = addressService.getErrors(state.address);
  const keys = Object.keys(errors);

  if (keys.length > 0) {
    keys.forEach((key) => {
      setFormError(key, errors[key]);
    });
  } else {
    listController.addCard(state.address);
    clearForm();
  }
}

async function handleInputCepChange(event) {
  const cep = event.target.value;
  try {
    const address = await addressService.findByCep(cep);

    if (address.street == '') {
      address.street = 'Centro';
      state.inputStreet.value = address.street;
    } else {
      state.inputStreet.value = address.street;
    }

    state.inputCity.value = address.city;

    state.address = address;

    state.inputNumber.focus();

    setFormError('cep', '');
  } catch (e) {
    state.inputStreet.value = '';
    state.inputCity.value = '';

    setFormError('cep', 'Informe um CEP válido');
  }
}

function handleInputNumberKeyup(event) {
  state.address.number = event.target.value;
}

// other functions
function clearForm() {
  state.inputCep.value = '';
  state.inputNumber.value = '';
  state.inputStreet.value = '';
  state.inputCity.value = '';

  setFormError('cep', '');
  setFormError('number', '');

  state.address = new Address();

  state.inputCep.focus();
}

function setFormError(key, message) {
  const element = document.querySelector(`[data-error="${key}"]`);
  element.innerHTML = message;
}
