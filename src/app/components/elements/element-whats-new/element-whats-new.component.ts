import { Component, OnInit } from '@angular/core';
import {ClientService} from "../../../services/client.service";
import {ApiResponse} from "../../../interfaces/api-response";
import {ThemeService} from "../../../services/theme.service";

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
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingStatus = 'Fetching new items...'
    this.clientService.getWhatsNew().subscribe((result: ApiResponse) => {
      this.loading = false;
      this.whatsNew = result.data.newItems || [];
    }, error => {
      this.loading = false;
      this.failure = true;
      this.resultmessage = error.error.message;
    });
  }

}
