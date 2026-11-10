import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { Comidas } from '../entidades/comidas'; 
import { CompartirDatosService } from '../servicios/pedido.service';
import { ComidaApiService } from '../servicios/comida-api.service';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  comida: Comidas = new Comidas();
  listaComidas: Comidas[] = [];

  categoriaSeleccionada: string = '';
  mostrarPlatos: boolean = false;
  
  textoBusquedaNombre: string = '';
  textoBusquedaIngrediente: string = '';
  mostrarModal: boolean = false;
  mensajeModal: string = '';

  private dateService = inject(CompartirDatosService);
  private comidaApi = inject(ComidaApiService);
  private router = inject(Router);

  ngOnInit(): void {
    
    this.cargarComidasDesdeApi('a');
  }

  
  private procesarDatosApi(meals: any[]) {
    
    this.listaComidas = meals.slice(0, 12).map(item => {
      const descripcionPlato = item.strInstructions 
        ? item.strInstructions.substring(0, 90) + '...' 
        : 'Delicioso plato preparado al estilo Manila.';
      
      
      const precioRandom = Math.floor(Math.random() * (45 - 15 + 1) + 15) * 1000;

      
      return new Comidas(
        item.strMeal,                    
        item.strCategory || 'General',   
        descripcionPlato,               
        precioRandom,                    
        item.strMealThumb,              
        1                                
      );
    });
  }

  cargarComidasDesdeApi(query: string) {
    this.comidaApi.buscarPorNombre(query).then(meals => {
      if (meals) this.procesarDatosApi(meals);
    });
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.textoBusquedaNombre = '';
    this.textoBusquedaIngrediente = '';
    this.mostrarPlatos = true;

    this.comidaApi.buscarPorCategoria(cat).then(meals => {
      if (meals) this.procesarDatosApi(meals);
    });
  }

  buscarPorNombre() {
    if (!this.textoBusquedaNombre.trim()) return;
    this.categoriaSeleccionada = '';
    this.mostrarPlatos = true;

    this.comidaApi.buscarPorNombre(this.textoBusquedaNombre).then(meals => {
      if (meals) this.procesarDatosApi(meals);
      else this.listaComidas = [];
    });
  }

  buscarPorIngrediente() {
    if (!this.textoBusquedaIngrediente.trim()) return;
    this.categoriaSeleccionada = '';
    this.mostrarPlatos = true;

    this.comidaApi.buscarPorIngrediente(this.textoBusquedaIngrediente).then(meals => {
      if (meals) this.procesarDatosApi(meals);
      else this.listaComidas = [];
    });
  }

  get comidasFiltradas() {
    return this.listaComidas;
  }

  comprar(comidaSeleccionada: Comidas) {
    const cantidadElegida = comidaSeleccionada.cantidad || 1;
    
    const itemConTipo = { 
      ...comidaSeleccionada, 
      tipo: 'comida', 
      cantidad: cantidadElegida 
    };

    this.dateService.enviar(itemConTipo);

    this.mensajeModal = comidaSeleccionada.nombre + ' fue agregada correctamente al pedido (cantidad: ' + cantidadElegida + ')';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}