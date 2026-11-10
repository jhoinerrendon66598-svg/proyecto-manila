import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComidaApiService {

  private urlNombre = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  private urlIngrediente = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
  private urlCategoria = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';

  constructor() { }

  buscarPorNombre(nombre: string) {
    return fetch(this.urlNombre + nombre)
      .then(res => res.json())
      .then(data => data.meals || [])
      .catch(err => {
        console.error('Error al buscar por nombre:', err);
        return [];
      });
  }

  buscarPorIngrediente(ingrediente: string) {
    return fetch(this.urlIngrediente + ingrediente)
      .then(res => res.json())
      .then(data => data.meals || [])
      .catch(err => {
        console.error('Error al buscar por ingrediente:', err);
        return [];
      });
  }

  buscarPorCategoria(categoria: string) {
    return fetch(this.urlCategoria + categoria)
      .then(res => res.json())
      .then(data => data.meals || [])
      .catch(err => {
        console.error('Error al buscar por categoría:', err);
        return [];
      });
  }
}