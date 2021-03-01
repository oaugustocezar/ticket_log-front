import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cidade } from './cidade.model';
import { Estado } from './estado.model';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class CidadeService {
  currentEstado: Estado | undefined;
  @Output() savedCidade: EventEmitter<Notification> = new EventEmitter();
  @Output() deletedCidade: EventEmitter<Notification> = new EventEmitter();

  constructor(private http: HttpClient) {}

  getCidadesList() {
    return this.http.get(environment.apiCidade).toPromise();
  }

  getCidadesListPorEstado(uf: String) {
    return this.http.get(environment.apiCidade + `/filter?uf=${uf}`);
  }

  getPagePorEstado(uf: string) {
    return this.http
      .get<Cidade[]>(
        `${environment.apiCidade}/filter?uf=${uf}`
      )
      ;
  }

  saveCidade(data: Cidade) {
    return this.http.post(`${environment.apiCidade}`, data).toPromise();
  }

  saveCidadeFromFile(data: FormData) {
    return this.http
      .post(`${environment.apiCidade}/upload`, data)
      .toPromise();
  }

  deleteCidade(name: string) {
    return this.http
      .delete(`${environment.apiCidade}?name=${name}`);
  }

  deleteCidadesList(data: Cidade[]) {
    return this.http
      .put(`${environment.apiCidade}/deletelist`, data)
      .toPromise();
  }
}
