import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Cidade } from '../shared/cidade.model';
import { CidadeService } from '../shared/cidade.service';
import { Notification } from '../shared/notification.model';
import { Page } from '../shared/page.model';
import { Estado } from 'src/app/shared/estado.model';
import { Router } from '@angular/router';
import { map, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-cidades',
  templateUrl: './cidades.component.html',
})
export class CidadesComponent implements OnInit {
  @Input() uf = '';
  @Input() estado: Estado | undefined;
  formData = new Cidade();
  savingCidade = false;
  pageOfCidades = new Page();
  cidadesList: Cidade[] = [];
  open = false
  selectedCidade: Cidade | undefined
  selectedCidades: Cidade[] = []
  modoEdicao = false;
  askDeleteGroup = false
  data = [];

  constructor(private cidadeService: CidadeService, private router: Router) { }

  ngOnInit(): void {
    this.subscribeNotifications();
    this.setCidadePage(this.uf);
  }

  saveCidade() {
    this.setEvenMessage()
    this.savingCidade = true;

    this.formData.uf = this.estado?.uf;
    this.cidadeService
      .saveCidade(this.formData)
      .then((response) => {
        this.setEvenMessage(true,'Cidade não pode ser salva','error')
        this.savingCidade = false;
      })
      .then(() => {
        this.router.navigate([`/`]);
      })
      .catch((err) => {
        this.setEvenMessage(true,'Cidade salva com sucesso','successfully')
        this.savingCidade = false;
      });
  }

  private setEvenMessage(show = false, msg = '', type = '') {
    this.cidadeService.savedCidade.emit({
      show: show,
      msg: msg,
      type: type,
    });
  }

  nextPage() {
    this.setCidadePage(this.uf);
  }

  previousPage() {
    this.setCidadePage(this.uf);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uf) this.setCidadePage(this.uf);
  }

  selectCidade(cidade: Cidade) {
    this.open = true;
    this.selectedCidade = cidade
  }

  selectCidades() {
    this.selectedCidades = this.cidadesList.filter(cidade => cidade.isChecked)
    console.log(this.selectedCidades);

  }



  deleteCidade(event: { isConfirmed: boolean }) {
    this.setDeleteEvenMessage();

    if (event.isConfirmed) {
      this.cidadeService.deleteCidade(this.selectedCidade?.name || "{}").toPromise().then(res=>{
        this.setDeleteEvenMessage(true, 'Cidade removida', 'succesfuly');
        console.log(res);
      }).catch(err=>{
        this.setDeleteEvenMessage(true, 'Cidade não pode ser removida', 'error');
        console.log(err);
      });
      /*.toPromise().then(res=>{
        this.setDeleteEvenMessage(true, 'Cidade removida', 'succesfuly');
      }).catch(err=>{
        this.setDeleteEvenMessage(true, 'Cidade não pode ser removida', 'error');

      })*/

    }
    else {
      this.open = false;
      this.selectedCidade = undefined
    }
  }

  deleteCidadeList(event: { isConfirmed: boolean }) {
    this.setDeleteEvenMessage();
    if (event.isConfirmed) {
      this.cidadeService.deleteCidadesList(this.selectedCidades)
        .then(res => {
          this.setDeleteEvenMessage(false, 'Lista de cidades removida', 'error')
        })
        .catch(err => {
          this.setDeleteEvenMessage(true, 'Cidade Removida', 'successfully')
        })
    }
    else {
      this.askDeleteGroup = false;
      this.selectedCidades = []
    }
  }


  private setDeleteEvenMessage(show = false, msg = '', type = '') {
    this.cidadeService.deletedCidade.emit({
      show: show,
      msg: msg,
      type: type,
    });
  }

  private subscribeNotifications() {
    this.cidadeService.savedCidade.subscribe((notification: Notification) => {
      if (notification.type === "successfully")
        this.setCidadePage(this.uf);
    });
    this.cidadeService.deletedCidade.subscribe((notification: Notification) => {
      if (notification.type === "successfully") {
        this.open = false;
        this.askDeleteGroup = false
        this.modoEdicao = false
        this.setCidadePage(this.uf);
      }

    });
  }
  private setCidadePage(uf: string) {
    this.cidadeService.getPagePorEstado(uf).subscribe(response =>{

      this.cidadesList = response;

    })
  }
}
