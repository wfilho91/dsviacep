import Address from '../models/address.mjs';
import * as requestService from '../services/request-service.mjs';

export async function findByCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  const data = await requestService.getData(url);
  const address = new Address(data.cep, data.logradouro, null, data.localidade);

  return address;
}

export function getErrors(address) {
  const errors = {};

  if (!address.cep || address.cep == '') {
    errors.cep = 'Campo requerido';
  }

  if (!address.number || address.number == '') {
    errors.number = 'Campo requerido';
  }

  return errors;
}
