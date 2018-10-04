import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';
import { ApiResponse } from '../../../interfaces/api-response';

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
    public clientService: ClientService
  ) { }

  ngOnInit() {
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
    this.clientService.newNewsMessage().subscribe((result: ApiResponse) => {
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = result.message;
    }, error => {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error.error.message;
    });
  }

}
