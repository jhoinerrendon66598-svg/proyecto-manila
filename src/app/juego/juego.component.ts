import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Carta {
  id: number;
  tipo: 'comida' | 'bebida' | 'vacia';
  imagen: string;
  volteada: boolean;
}

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {
  
  cartas: Carta[] = [];
  juegoTerminado: boolean = false;
  encontroComida: boolean = false;
  encontroBebida: boolean = false;

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.juegoTerminado = false;
    this.encontroComida = false;
    this.encontroBebida = false;
    
    let mazo: Carta[] = [];
    let idCounter = 1;

    
    mazo.push({
      id: idCounter++,
      tipo: 'comida',
      imagen: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
      volteada: false
    });

    
    mazo.push({
      id: idCounter++,
      tipo: 'bebida',
      imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
      volteada: false
    });

    
    for (let i = 0; i < 14; i++) {
      mazo.push({
        id: idCounter++,
        tipo: 'vacia',
        imagen: '',
        volteada: false
      });
    }

    
    this.cartas = mazo.sort(() => Math.random() - 0.5);
  }

  voltearCarta(carta: Carta) {
    
    if (this.juegoTerminado || carta.volteada) return;

    carta.volteada = true;

    
    if (carta.tipo === 'comida') {
      this.encontroComida = true;
    } else if (carta.tipo === 'bebida') {
      this.encontroBebida = true;
    }

    
    if (this.encontroComida && this.encontroBebida) {
      this.juegoTerminado = true;
    }
  }
}
