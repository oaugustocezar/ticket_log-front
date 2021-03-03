import { Component, OnInit,Input } from '@angular/core';
import { CidadeService } from '../shared/cidade.service';
import { Estado } from '../shared/estado.model';
import { EstadoService } from '../shared/estado.service';
import { Notification } from '../shared/notification.model';
import { Cidade } from 'src/app/shared/cidade.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @Input() estado: Estado | undefined;
  formData = new Cidade();
  estados = 'Santa Catarina';
  nomeOfState = 'Santa Catarina';
  url = 'assets/svg/Bandeira_de_Santa_Catarina.svg';
  estadoSelected: Estado | undefined;
  closePopUp = false;
  savingCidade = false;


  options = [
    {
      nome: 'Rio Grande do Sul',
      uf: 'Rio Grande do Sul',
      url: 'assets/svg/Bandeira_do_Rio_Grande_do_Sul.png',
    },
    {
      nome: 'Santa Catarina',
      uf: 'Santa Catarina',
      url: 'assets/svg/Bandeira_de_Santa_Catarina.svg',
    },
    {
      nome: 'Paraná',
      uf: 'Paraná',
      url: 'assets/svg/Bandeira_do_Paraná.svg',
    },
  ];

  constructor(
    private estadoService: EstadoService,
    private cidadeService: CidadeService,private router: Router
  ) { }

  ngOnInit(): void {
    this.subscribeNotifications();
    this.setEstadoSelected(this.estados);
  }

  limpar(){
    this.formData.name = "";
    this.formData.population = parseInt('');
  }


  saveCidade() {
    this.setEvenMessage()
    this.savingCidade = true;

    this.formData.uf = this.estados;
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


  selectEstado() {
    let value = this.nomeOfState;
    let estadoSelected = this.options.filter(
      (estados) => estados.nome === value
    )[0];
    this.estados = estadoSelected.uf;
    this.url = estadoSelected.url;
    this.setEstadoSelected(this.estados);
  }

  newCidade() {
    this.closePopUp = false;
  }

  private setEstadoSelected(uf: string) {
    this.estadoService
      .getEstadoById(uf)
      .then((estados) => {
        this.estadoSelected = estados as Estado;
        this.estadoSelected.urlImage = this.url;
      })
      .catch((err) => { });
  }

  private subscribeNotifications() {
    this.cidadeService.savedCidade.subscribe((notification: Notification) => {
      if (notification.type === "successfully") {
        this.closePopUp = true;
        this.setEstadoSelected(this.estadoSelected?.uf || this.estados);
      }
    });
    this.cidadeService.deletedCidade.subscribe((notification: Notification) => {
      if (notification.type === "successfully")
        this.setEstadoSelected(this.estadoSelected?.uf || this.estados);

    });
  }
  private setEvenMessage(show = false, msg = '', type = '') {
    this.cidadeService.savedCidade.emit({
      show: show,
      msg: msg,
      type: type,
    });
  }
}
