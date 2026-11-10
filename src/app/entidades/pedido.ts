import { Comidas } from "./comidas";
import { Bebidas } from "./bebidas";

export class Pedido {
  
  comida: Comidas = new Comidas();
  bebida: Bebidas = new Bebidas();
  total: number = 0;

  constructor() {

  }
}