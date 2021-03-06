import { Component, OnInit } from '@angular/core';
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';

@Component({
  selector: 'app-element-whats-new',
  templateUrl: './element-whats-new.component.html',
  styleUrls: ['./element-whats-new.component.scss']
})
export class ElementWhatsNewComponent implements OnInit {
  whatsNew: Array<any> = [];
  loading: Boolean = false;
  failure: Boolean = false;
  loadingStatus: String = '';
  resultmessage: String = '';

  constructor(
    public clientService: ClientService,
    public themeService: ThemeService,
    private firebaseModuleService: FirebaseModuleService,
    private firebaseUserService: FirebaseUserService

  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching new items...'
    this.firebaseUserService.getCurrentUser().subscribe((users)=>{
      this.firebaseModuleService.getModulesAddedToday(users[0].client_id).subscribe((modules)=>{
          this.whatsNew = modules || []
          this.loading = false;
      })
    })
  }

}
