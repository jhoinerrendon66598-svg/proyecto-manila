export class Comidas {
  nombre: string = "";
  categoria: string = "";
  descripcion: string = "";
  precio: number = 0;
  imagen: string = "";
  cantidad: number = 1;

  constructor(nombre: string = "", categoria: string = "", descripcion: string = "", precio: number = 0, imagen: string = "", cantidad: number = 1) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
    this.cantidad = cantidad;
  }
}