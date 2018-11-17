import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';
import { resolve } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos() {

    return new Promise( ( resolve, reject ) => {

    this.http.get('https://angular-html-d6af9.firebaseio.com/productos_idx.json')
    .subscribe(( resp: Producto[]) => {
      this.productos = resp;
      this.cargando = false;
      // pone un tiempo de espera para ejecutar la accion
    //  setTimeout(() => {
      //  this.cargando = false;
      // }, 2000);
      resolve();
    });

  });

  }

  getProducto( id: string) {
   return this.http.get(`https://angular-html-d6af9.firebaseio.com/productos/${ id }.json`);
  }

  buscarProducto( termino: string ) {
    if (this.productos.length === 0 ) {
      // cargar productos
      this.cargarProductos().then( () => {
        // ejecutar despues de tener los productos
        // Aplicar filtro
        this.filtrarProductos( termino );
      });
    } else  {
      // aplicar el filtro
      this.filtrarProductos( termino );
    }
  //  this.productosFiltrado = this.productos.filter( producto => {
    //  return true;
    // });
   // console.log(this.productosFiltrado);
  }

  private filtrarProductos( termino: string) {
  // console.log(termino);
  termino = termino.toLocaleLowerCase();

   this.productosFiltrado = [];
   this.productos.forEach( prod => {
     const tituloLower = prod.titulo.toLocaleLowerCase();
     const categoriaLower = prod.categoria.toLocaleLowerCase();
     if ( categoriaLower.indexOf( termino ) >= 0 || tituloLower.indexOf ( termino ) > 0 ) {
       this.productosFiltrado.push( prod );
     }

   });
   // console.log(this.productosFiltrado);
  }
}
