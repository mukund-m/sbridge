import { Component, OnInit, OnDestroy } from '@angular/core';
import {BasePage} from "../../../abstract-classes/base-page";
import {Client} from "../../../models/client";
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {Subscription} from "rxjs/Subscription";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';

@Component({
  selector: 'app-page-clients',
  templateUrl: './page-clients.component.html',
  styleUrls: ['./page-clients.component.scss']
})
export class PageClientsComponent extends BasePage implements OnInit {
  canLoadMore: Boolean = false;
  searchParam: String = '';
  offset: any = 0;
  limit: any = 12;
  clientSubscription$: Subscription;
  clients: Array<Client> = [];
  fetchingResults: Boolean = false;
  isSearched: Boolean = false;
  isEditting: Boolean = false;
  submitted: Boolean = false;
  modalSuccess: Boolean = false;
  modalFailure: Boolean = false;
  modalLoading: Boolean = false;
  modalResultMessage: String = '';
  loadingStatus: String = '';
  addClientFormGroup: FormGroup;
  selectedClient: Client;
  primaryColor: String = '';
  secondaryColor: String = '';
  tertiaryColor: String = '';
  subscription: Subscription;

  constructor(
    public modalService: NgbModal,
    public navigationService: NavigationService,
    private firebaseClientService: FirebaseClientService
  ) {
    super();
    navigationService.isDashboard = true;
  }

  ngOnInit() {
    this.offset = 0;
    this.getClients();
    this.clearContent();
  }

  changeColor(event, type) {
    if (type === 'primary') {
      this.addClientFormGroup.controls['primaryColor'].setValue(event);
    } else if (type === 'secondary') {
      this.addClientFormGroup.controls['secondaryColor'].setValue(event);
    } else if (type === 'tertiary') {
      this.addClientFormGroup.controls['tertiaryColor'].setValue(event);
    }
  }

  getClients() {
    
    this.fetchingResults = true;
    this.subscription = this.firebaseClientService.getAllClients().subscribe((clients)=> {
      this.clients = [];
      this.fetchingResults = false;
      this.offset++;
      if (clients === this.limit) {
        this.canLoadMore = true;
      }
      for (const client of clients) {
        this.clients.push(new Client(client));
      }
    })
  }

  setClient(client) {
    this.selectedClient = client;
    this.addClientFormGroup.controls['name'].setValue(this.selectedClient.name);
    this.addClientFormGroup.controls['defaultSquareLogoUrl'].setValue(this.selectedClient.theme.images.defaultSquareLogo);
    this.addClientFormGroup.controls['defaultLogoUrl'].setValue(this.selectedClient.theme.images.defaultLogo);
    this.addClientFormGroup.controls['leaderboardEnabled'].setValue(this.selectedClient.leaderboardEnabled);
    this.addClientFormGroup.controls['newsflashEnabled'].setValue(this.selectedClient.newsflashEnabled);
    this.addClientFormGroup.controls['whatsNewEnabled'].setValue(this.selectedClient.whatsNewEnabled);
    this.addClientFormGroup.controls['defaultBackgroundUrl'].setValue(this.selectedClient.theme.images.defaultBackground);
    this.addClientFormGroup.controls['primaryColor'].setValue(this.selectedClient.theme.colors.primaryColor);
    this.addClientFormGroup.controls['secondaryColor'].setValue(this.selectedClient.theme.colors.secondaryColor);
    this.addClientFormGroup.controls['tertiaryColor'].setValue(this.selectedClient.theme.colors.tertiaryColor);
    this.addClientFormGroup.controls['signupMessage'].setValue(this.selectedClient.content.signupMessage);
    this.addClientFormGroup.controls['resetMessage'].setValue(this.selectedClient.content.resetMessage);
  }

  submitClient() {
    this.submitted = true;
    if (this.addClientFormGroup.valid) {
      const client: any = {
        name: this.addClientFormGroup.controls['name'].value,
        leaderboardEnabled: this.addClientFormGroup.controls['leaderboardEnabled'].value || false,
        newsflashEnabled: this.addClientFormGroup.controls['newsflashEnabled'].value || false,
        whatsNewEnabled: this.addClientFormGroup.controls['whatsNewEnabled'].value || false,
        theme: {
          images: {
            defaultSquareLogo: this.addClientFormGroup.controls['defaultSquareLogoUrl'].value || "",
            defaultLogo: this.addClientFormGroup.controls['defaultLogoUrl'].value || "",
            defaultBackground: this.addClientFormGroup.controls['defaultBackgroundUrl'].value || ""
          },
          colors: {
            primaryColor: this.addClientFormGroup.controls['primaryColor'].value || "",
            secondaryColor: this.addClientFormGroup.controls['secondaryColor'].value || "",
            tertiaryColor: this.addClientFormGroup.controls['tertiaryColor'].value || ""
          },
        },
        content: {
          signupMessage: this.addClientFormGroup.controls['signupMessage'].value || "",
          resetMessage: this.addClientFormGroup.controls['resetMessage'].value || ""
        }
      };
      this.modalLoading = true;
      if (!this.isEditting) {
        this.loadingStatus = 'Adding client...';
        this.firebaseClientService.addClient(client).then((result)=> {
          client._id = result.id;
          this.firebaseClientService.updateClient(client._id, client).then(()=> {
            this.modalSuccess = true;
            this.modalLoading = false; 
            this.modalResultMessage = result.message;
          })
          
        }).catch((reason)=> {
          this.modalFailure = true;
          this.modalLoading = false;
          this.modalResultMessage = reason;
        })
      } else {
        this.loadingStatus = 'Updating client...';
        this.firebaseClientService.updateClient(this.selectedClient._id, client).then((result)=> {
          this.modalSuccess = true;
          this.modalLoading = false;
          this.modalResultMessage = 'Updated Successfully';
        }).catch((message)=> {
          this.modalFailure = true;
          this.modalLoading = false;
          this.modalResultMessage = message;
        })
        
      }
    }
  }

  clearModal() {
    this.modalFailure = false;
    this.modalSuccess = false;
    this.modalLoading = false;
    this.loadingStatus = '';
    this.submitted = false;
  }

  removeClient() {
    this.modalLoading = true;
    this.firebaseClientService.delete(this.selectedClient._id).then(()=> {
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'Client removed successfully';
      const index = this.clients.indexOf(this.selectedClient);
      this.clients.splice(index, 1);
    }).catch((message)=> {
      this.modalFailure = false;
      this.modalLoading = false;
      this.modalResultMessage = message;
    })
  }

  updateGetClients(event) {
    
  }

  open(content) {
    this.modalService.open(content);
  }

  clearContent() {
    this.clearModal();
    this.addClientFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      defaultLogoUrl: new FormControl(''),
      leaderboardEnabled: new FormControl(''),
      newsflashEnabled: new FormControl(''),
      whatsNewEnabled: new FormControl(''),
      defaultSquareLogoUrl: new FormControl(''),
      defaultBackgroundUrl: new FormControl(''),
      primaryColor: new FormControl(''),
      secondaryColor: new FormControl(''),
      tertiaryColor: new FormControl(''),
      signupMessage: new FormControl(''),
      resetMessage: new FormControl('')
    });
  }

  emptyClient() {

  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
