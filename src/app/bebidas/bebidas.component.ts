import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { Bebidas } from '../entidades/bebidas'; // <--- Tu entidad original intacta
import { CompartirDatosService } from '../servicios/pedido.service';
import { BebidaApiService } from '../servicios/bebida-api.service';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  bebida: Bebidas = new Bebidas();
  listaBebidas: Bebidas[] = [];
  
  categoriaSeleccionada: string = '';
  mostrarBebidas: boolean = false;

  textoBusquedaNombre: string = '';
  textoBusquedaIngrediente: string = '';
  tipoSeleccionado: string = 'Elegir';
  categoriaSelect: string = 'Elegir';
  mostrarModal: boolean = false;
  mensajeModal: string = '';

  private dateService = inject(CompartirDatosService);
  private bebidaApi = inject(BebidaApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.bebida = new Bebidas();
    
    this.cargarBebidasDesdeApi('a');
  }

  
  private procesarDatosApi(drinks: any[]) {
    this.listaBebidas = drinks.slice(0, 12).map(item => {
      // Precios cerrados exactos en miles (ej: 18000, 24000, 31000)
      const precioCerrado = Math.floor(Math.random() * (40 - 10 + 1) + 10) * 1000;
      
      const descripcionBebida = item.strInstructions 
        ? item.strInstructions.substring(0, 85) + '...' 
        : 'Refrescante bebida preparada al estilo exclusivo de Manila.';

      return new Bebidas(
        item.strDrink,                       
        item.strCategory || 'Cocktail',      
        descripcionBebida,                  
        precioCerrado,                       
        item.strDrinkThumb,                 
        1                                   
      );
    });
  }

  cargarBebidasDesdeApi(query: string) {
    this.bebidaApi.buscarPorNombre(query).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
    });
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.tipoSeleccionado = 'Elegir';
    this.categoriaSelect = 'Elegir';
    this.textoBusquedaNombre = '';
    this.textoBusquedaIngrediente = '';
    this.mostrarBebidas = true;

    this.bebidaApi.buscarPorCategoria(cat).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
    });
  }

  buscarPorNombre() {
    if (!this.textoBusquedaNombre.trim()) return;
    this.categoriaSeleccionada = '';
    this.tipoSeleccionado = 'Elegir';
    this.categoriaSelect = 'Elegir';
    this.mostrarBebidas = true;

    this.bebidaApi.buscarPorNombre(this.textoBusquedaNombre).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
      else this.listaBebidas = [];
    });
  }

  buscarPorIngrediente() {
    if (!this.textoBusquedaIngrediente.trim()) return;
    this.categoriaSeleccionada = '';
    this.tipoSeleccionado = 'Elegir';
    this.categoriaSelect = 'Elegir';
    this.mostrarBebidas = true;

    this.bebidaApi.buscarPorIngrediente(this.textoBusquedaIngrediente).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
      else this.listaBebidas = [];
    });
  }

  
  cambiarTipo() {
    this.categoriaSelect = 'Elegir';
    this.categoriaSeleccionada = '';
    this.mostrarBebidas = true;

    const parametroApi = this.tipoSeleccionado === 'Alcoholica' ? 'Alcoholic' : 'Non_Alcoholic';
    this.bebidaApi.buscarPorAlcohol(parametroApi).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
    });
  }

  
  cambiarCategoriaSelect() {
    this.tipoSeleccionado = 'Elegir';
    this.categoriaSeleccionada = '';
    this.mostrarBebidas = true;

    const catApi = this.categoriaSelect === 'Nacional' ? 'Ordinary_Drink' : 'Cocktail';
    this.bebidaApi.buscarPorCategoria(catApi).then(drinks => {
      if (drinks) this.procesarDatosApi(drinks);
    });
  }

  get bebidasFiltradas() {
    return this.listaBebidas;
  }

  comprar(bebidaSeleccionada: Bebidas) {
    const cantidadElegida = bebidaSeleccionada.cantidad || 1;
    
    const itemConTipo = { 
      ...bebidaSeleccionada, 
      tipo: 'bebida', 
      cantidad: cantidadElegida 
    };

    this.dateService.enviar(itemConTipo);

    this.mensajeModal = bebidaSeleccionada.nombre + ' fue agregada correctamente al pedido (cantidad: ' + cantidadElegida + ')';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}