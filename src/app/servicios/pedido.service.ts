import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {
  private platformId = inject(PLATFORM_ID);
  
  
  public pedidoSignal = signal<any[]>(this.obtenerPedidoInicial());

  private obtenerPedidoInicial() {
    if (isPlatformBrowser(this.platformId)) {
      const pedidoGuardado = localStorage.getItem('pedidoActual');
      return pedidoGuardado ? JSON.parse(pedidoGuardado) : [];
    }
    return [];
  }

  
  enviar(datoProducto: any) {
    console.log('Guardando producto en el pedido:', datoProducto);
    
    
    const listaActual = this.pedidoSignal();
    
    
    const nuevaLista = [...listaActual, datoProducto];

    this.pedidoSignal.set(nuevaLista);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('pedidoActual', JSON.stringify(nuevaLista));
    }
  }

  
  limpiar() {
    this.pedidoSignal.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('pedidoActual');
    }
  }

  constructor() { }
}