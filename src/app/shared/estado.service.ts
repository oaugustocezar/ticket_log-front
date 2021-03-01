import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Estado } from './estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  estadosList:Estado[] = []
  estado:Estado = new Estado

  constructor(private http: HttpClient) { }

  getEstadosList() {
    return this.http.get(environment.apiEstado).toPromise()
  }


  getEstadoById(uf: string) {
    return this.http.get(`${environment.apiEstado}/get?uf=${uf}`).toPromise();
  }

  saveEstado(data: Estado) {
    return this.http.post(`${environment.apiEstado}/save`, data).toPromise()
  }

  deleteEstado(id: string) {
    return this.http.delete(`${environment.apiEstado}/delete/${id}`).toPromise()
  }

  updateEstado(id:string, data: Estado) {
    return this.http.post(`${environment.apiEstado}/update/${id}`, data).toPromise()
  }
}
