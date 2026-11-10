import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BebidaApiService {

  private urlNombre = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  private urlIngrediente = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
  private urlFiltroAlcohol = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a='; // Alcoholic / Non_Alcoholic
  private urlFiltroCategoria = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';

  constructor() { }

  buscarPorNombre(nombre: string) {
    return fetch(this.urlNombre + nombre)
      .then(res => res.json())
      .then(data => data.drinks || [])
      .catch(err => {
        console.error('Error al buscar bebida por nombre:', err);
        return [];
      });
  }

  buscarPorIngrediente(ingrediente: string) {
    return fetch(this.urlIngrediente + ingrediente)
      .then(res => res.json())
      .then(data => data.drinks || [])
      .catch(err => {
        console.error('Error al buscar bebida por ingrediente:', err);
        return [];
      });
  }

  buscarPorAlcohol(tipo: string) {
    // tipo puede ser 'Alcoholic' o 'Non_Alcoholic'
    return fetch(this.urlFiltroAlcohol + tipo)
      .then(res => res.json())
      .then(data => data.drinks || [])
      .catch(err => {
        console.error('Error al filtrar por tipo de alcohol:', err);
        return [];
      });
  }

  buscarPorCategoria(categoria: string) {
    return fetch(this.urlFiltroCategoria + categoria)
      .then(res => res.json())
      .then(data => data.drinks || [])
      .catch(err => {
        console.error('Error al filtrar por categoría de bebida:', err);
        return [];
      });
  }
}