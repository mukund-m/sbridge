import { Injectable } from '@angular/core';
import {ClientService} from "./client.service";

@Injectable()
export class ThemeService {
  color: any = {
    primaryColor: '#2196F3',
    secondaryColor: '',
    tertiaryColor: ''
  };
  navigation: any = {
    squareLogo: '',
    logo:  '',
    logoColor: '',
    bg: 'light',
    textColor: '',
    textHoverColor: ''
  };
  body: any = {
    backgroundImage: '/assets/images/default-bg.jpg'
  };

  constructor(
    public clientService: ClientService
  ) { }

  initialize() {
    this.color = this.clientService.currentClient.theme.colors;
    this.navigation.squareLogo = this.clientService.currentClient.theme.images.defaultSquareLogo;
    this.navigation.logo = this.clientService.currentClient.theme.images.defaultLogo;
    console.log(this.color);
  }

}
