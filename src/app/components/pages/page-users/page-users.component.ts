import { Component, OnInit, OnDestroy } from '@angular/core';
import {BasePage} from "../../../abstract-classes/base-page";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {Subscription} from "rxjs/Subscription";
import {ThemeService} from "../../../services/theme.service";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../services/client.service";
import {Client} from "../../../models/client";
import {HttpEventType} from "@angular/common/http";
import {ApiResponse} from "../../../interfaces/api-response";
import {AuthenticationService} from "../../../services/authentication.service";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseUserService } from '../../../firebase-services/firebase-user.service';
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-page-users',
  templateUrl: './page-users.component.html',
  styleUrls: ['./page-users.component.scss']
})
export class PageUsersComponent extends BasePage implements OnInit {
  canLoadMore: Boolean = false;
  searchParam: string = '';
  page: any = 0;
  limit: any = 12;
  users: Array<User> = [];
  filteredUsers: Array<User> = [];
  fetchingResults: Boolean = false;
  isSearched: Boolean = false;
  getUsersSubscription: Subscription;
  selectedUser: User;
  isEditing: Boolean = false;
  userForm: FormGroup;
  fetchingClients: Boolean = false;
  clients: Array<Client> = [];
  modalSuccess: Boolean = false;
  modalFailure: Boolean = false;
  modalLoading: Boolean = false;
  modalResultMessage: String = '';
  submitted: Boolean = false;
  selectedClient: Client;
  private subscription: Subscription;
  private sub2: Subscription;


  constructor(
    private _authenticationService: AuthenticationService,
    public userService: UserService,
    public modalService: NgbModal,
    public clientService: ClientService,
    public themeService: ThemeService,
    public navigationService: NavigationService,
    private firebaseUserService: FirebaseUserService,
    private firebaseClientService: FirebaseClientService,
    private authService: AuthService
  ) {
    super();
  }

  emptyUser() {
    this.selectedUser = new User({});
  }

  getClients() {

    this.sub2 = this.firebaseUserService.getCurrentUser().subscribe((users: User[])=>{
      let user = users[0];
      this.clients = [];
      if(user.role === 'administrator') {
        this.loading = true;
        this.loadingStatus = 'Fetching Clients...';
        this.subscription = this.firebaseClientService.getAllClients().subscribe((clients)=> {
          this.loading = false;
          this.clients = [];
          for (const client of clients) {
            this.clients.push(new Client(client));
          }
          
        });

      } else {
        this.userForm.patchValue({client: this.clientService.client});
      }
    })

  }

  submitForm() {
    this.submitted = true;
    this.modalResultMessage = 'Creating user...';
    if (this.userForm.valid) {
      this.modalLoading = true;
      let userData = this.userForm.value;
      if(this._authenticationService.user.role == 'client') {
        userData.client_id = this._authenticationService.user.client_id;
      }
      this.firebaseUserService.addUser(this.userForm.value).then((user)=>{
       
        let data = this.userForm.value;
        
        data._id = user.id;
        this.firebaseUserService.update(data._id, data).then(()=> {
          this.modalLoading = false;
          this.modalSuccess = true;
          this.modalResultMessage = 'User created successfully';
        })
        this.users.push(new User(user));
      }).catch((error)=>{
        this.modalLoading = false;
        this.modalFailure = true;
        this.modalResultMessage = error;
      })
    }
  }

  removeUser() {
    this.modalLoading = true;
    this.modalResultMessage = 'Removing user...';
    this.firebaseUserService.delete(this.selectedUser._id).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'Removed Successfully';
    })
  }

  ngOnInit() {
    this.users = [];
    this.loading = true;
    this.clearUserForm();
    this.getUsers().then(result => { this.getClients(); });
  }

  open(content) {
    this.modalService.open(content);
  }

  getRole() {
    return this._authenticationService.user.role || null;
  }

  clearUserForm() {
    this.modalLoading = false;
    this.modalResultMessage = '';
    this.modalFailure = false;
    this.modalSuccess = false;
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      client_id: new FormControl(''),
      role: new FormControl('', [Validators.required])
    });
  }

  closeUserForm(content) {
    this.clearUserForm();
    content.close();
  }

  updateGetUsers(event) {
    const input = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9-_ \b]/.test(input)) {
      this.isSearched = true;
      this.page = 0;
      this.fetchingResults = true;
      if(this.users) {
        let totalUsers  = this.users;
        this.filteredUsers = [];
        for(let user of totalUsers) {
          if(user.firstName.toLowerCase().indexOf(this.searchParam.toLowerCase()) != -1 || 
          user.lastName.toLowerCase().indexOf(this.searchParam.toLowerCase()) != -1 ) {
            this.filteredUsers.push(user);
          }
        }
      }
      this.fetchingResults = false;
     
    }
  }

  updateGetUsersWithoutKey() {
    this.isSearched = true;
    this.page = 0;
    this.users = [];
    this.fetchingResults = true;
    this.getUsers().then(result => {
      this.fetchingResults = false;
    });
  }

  getUsers() {
    this.searchParam = '';
    return new Promise((resolve, reject) => {
      if (this.getUsersSubscription) {
        this.getUsersSubscription.unsubscribe();
      }
      const filterByClient = this.selectedClient ? 'client' : '';
      const client = (this.getRole() === 'administrator' && this.selectedClient) ? this.selectedClient._id : this.clientService.client;
      let filter = undefined;
      if(this.getRole() === 'administrator' && this.selectedClient) {
        filter = this.selectedClient._id;
      }
      if(this.getRole() == 'client') {
        filter = this._authenticationService.user.client_id;
      }
      if(filter) {
        this.getUsersSubscription = this.firebaseUserService.getUsersForClient(filter).subscribe((users)=> {
          this.users = [];
          this.loading = false;
          users.length === this.limit ? this.canLoadMore = true : this.canLoadMore = false;
            this.page += users.length;
            for (const user of users) {
                this.users.push(user);
            }
            this.filteredUsers = this.users;
            resolve();
        })
      }else{
        this.getUsersSubscription = this.firebaseUserService.getUsers().subscribe((users)=> {
          this.users = [];
          this.loading = false;
          users.length === this.limit ? this.canLoadMore = true : this.canLoadMore = false;
            this.page += users.length;
            for (const user of users) {
                this.users.push(user);
            }
            this.filteredUsers = this.users;
            resolve();
        })
      }
      
    });
    
    
  }

  ngOnDestroy() {
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
