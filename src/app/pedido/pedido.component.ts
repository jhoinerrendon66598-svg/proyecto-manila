import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Pedido } from '../entidades/pedido';
import { CompartirDatosService } from '../servicios/pedido.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {

  private dateService = inject(CompartirDatosService);

  pedido: Pedido = new Pedido();

  
  listaComidasPedido: any[] = [];

  nombre: string = '';
  telefono: string = '';
  direccion: string = '';

  
  mensajeAlerta: string = '';
  tipoAlerta: 'error' | 'exito' = 'error';

  ngOnInit(): void {
    
    const datosDelServicio = this.dateService.pedidoSignal();
    console.log("Datos actualizados:", datosDelServicio);

    if (datosDelServicio) {
      this.listaComidasPedido = datosDelServicio;
    }
  }

  
  quitarItem(nombrePlato: string) {
    let nuevaLista = [];
    for (let i = 0; i < this.listaComidasPedido.length; i++) {
      if (this.listaComidasPedido[i].nombre !== nombrePlato) {
        nuevaLista.push(this.listaComidasPedido[i]);
      }
    }
    this.listaComidasPedido = nuevaLista;
    
    
    this.dateService.pedidoSignal.set(this.listaComidasPedido);
  }

  confirmarPedido() {
    if (!this.nombre || !this.telefono || !this.direccion) {
      this.mostrarMensaje('Por favor complete todos los datos personales del comprador.', 'error');
      return;
    }

    if (this.listaComidasPedido.length === 0) {
      this.mostrarMensaje('¡Aún no se han agregado comidas ni bebidas al pedido!', 'error');
      return;
    }

    
    this.generarPDF();

    this.mostrarMensaje('¡Pedido confirmado con éxito para ' + this.nombre + '! Descargando comprobante PDF...', 'exito');

    
    this.dateService.limpiar();
    this.listaComidasPedido = [];
    this.nombre = '';
    this.telefono = '';
    this.direccion = '';
  }

  
  mostrarMensaje(texto: string, tipo: 'error' | 'exito') {
    this.mensajeAlerta = texto;
    this.tipoAlerta = tipo;
  }

  cerrarAlerta() {
    this.mensajeAlerta = '';
  }

  generarPDF() {
    const doc = new jsPDF();
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-CO');
    const hora = hoy.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // 1. Título y Encabezado
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MANILA', 105, 25, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Factura de Compra', 105, 33, { align: 'center' });

    // Línea divisoria dorada superior
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(1);
    doc.line(20, 42, 190, 42);

    // 2. Fecha y Hora
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fecha}`, 20, 52);
    doc.text(`Hora: ${hora}`, 20, 60);

    // 3. Datos del comprador
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del comprador', 20, 72);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${this.nombre}`, 20, 80);
    doc.text(`Teléfono: ${this.telefono}`, 20, 88);
    doc.text(`Dirección: ${this.direccion}`, 20, 96);

    // Línea divisoria dorada media
    doc.line(20, 104, 190, 104);

    // 4. Construcción de la tabla de ítems
    const filasTabla: any[] = [];
    for (let i = 0; i < this.listaComidasPedido.length; i++) {
      const item = this.listaComidasPedido[i];
      const precioUnitario = item.precio || 0;
      const cantidad = item.cantidad || 1;
      const subtotal = precioUnitario * cantidad;

      filasTabla.push([
        item.nombre,
        cantidad.toString(),
        `$ ${subtotal.toLocaleString('es-CO')}`
      ]);
    }

    autoTable(doc, {
      startY: 110,
      head: [['Producto', 'Cantidad', 'Subtotal']],
      body: filasTabla,
      theme: 'plain',
      tableWidth: 'wrap', 
      margin: { left: 20 },
      styles: {
        fontSize: 11,
        textColor: [30, 30, 30],
        cellPadding: 5
      },
      headStyles: {
        fontStyle: 'bold',
        textColor: [0, 0, 0],
        fontSize: 11,
        fillColor: false,
        halign: 'left'
      },
      
      columnStyles: {
        0: { cellWidth: 95, halign: 'left' },   
        1: { cellWidth: 35, halign: 'center' },  
        2: { cellWidth: 35, halign: 'right' }   
      },
      
      didParseCell: function (data) {
        if (data.section === 'head') {
          if (data.column.index === 0) {
            data.cell.styles.halign = 'left';
          } else if (data.column.index === 1) {
            data.cell.styles.halign = 'center';
          } else if (data.column.index === 2) {
            data.cell.styles.halign = 'right';
          }
        }
      }
    });

    
    const posicionFinal = (doc as any).lastAutoTable.finalY || 150;

    
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(1);
    doc.line(20, posicionFinal + 5, 190, posicionFinal + 5);

    
    const totalFormateado = this.calcularTotalGeneral().toLocaleString('es-CO');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $ ${totalFormateado}`, 190, posicionFinal + 18, { align: 'right' });

    
    doc.save('Factura_Manila.pdf');
  }

  calcularTotalGeneral() {
    let total = 0;
    for (let i = 0; i < this.listaComidasPedido.length; i++) {
      let precio = this.listaComidasPedido[i].precio || 0;
      let cantidad = this.listaComidasPedido.length > 0 ? (this.listaComidasPedido[i].cantidad || 1) : 1;
      total = total + (precio * cantidad);
    }
    return total;
  }

  tieneComidas() {
    for (let i = 0; i < this.listaComidasPedido.length; i++) {
      if (this.listaComidasPedido[i].tipo === 'comida') {
        return true;
      }
    }
    return false;
  }

  tieneBebidas() {
    for (let i = 0; i < this.listaComidasPedido.length; i++) {
      if (this.listaComidasPedido[i].tipo === 'bebida') {
        return true;
      }
    }
    return false;
  }

}