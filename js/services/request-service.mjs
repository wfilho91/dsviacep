import RequestException from './exceptions/request-exception.mjs';

export async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (e) {
    throw new RequestException('Error ao realizar requisição para url: ' + url);
  }
}
