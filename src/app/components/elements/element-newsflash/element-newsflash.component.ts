import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-element-newsflash',
  templateUrl: './element-newsflash.component.html',
  styleUrls: ['./element-newsflash.component.scss']
})
export class ElementNewsflashComponent implements OnInit {
  modalLoading: Boolean = false;
  modalSuccess: Boolean = false;
  modalFailure: Boolean = false;
  modalResultMessage: String = '';

  constructor(
    private _authenticationService: AuthenticationService,
    public themeService: ThemeService,
    public modalService: NgbModal,
    public clientService: ClientService,
    private firebaseClientService: FirebaseClientService,
    private firebaseUserService: FirebaseUserService
  ) { }

  client_news: String;
  client_id: string;
  ngOnInit() {
    this.firebaseUserService.getCurrentUser().subscribe((users)=>{
      this.firebaseClientService.getCurrentClient(users[0].client_id).subscribe((client)=>{
        this.client_news = client.news;
        this.client_id = client._id;
      })
    })
  }

  open(content) {
    this.modalService.open(content);
  }

  getRole() {
    return this._authenticationService.user.role;
  }

  clearErrors() {
    this.modalSuccess = false;
    this.modalFailure = false;
  }

  submitNewsMessage() {
    this.modalLoading = true;
    let subscription = this.firebaseClientService.getCurrentClient(this.client_id).subscribe((data)=>{
      subscription.unsubscribe();
      data.news = this.client_news;
      this.firebaseClientService.updateClient(this.client_id,data).then(()=>{
        this.modalLoading = false;
        this.modalSuccess = true;
        this.modalResultMessage = 'News updated successfully';
      }).catch((error)=>{
        this.modalLoading = false;
        this.modalFailure = true; 
        this.modalResultMessage = error;
      })
    })
    
  }

}
