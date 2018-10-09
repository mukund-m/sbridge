import { Component, OnInit, OnDestroy } from '@angular/core';
import { Module } from '../../../models/module';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ModuleService } from '../../../services/module.service';
import { ThemeService } from '../../../services/theme.service';
import { ClientService } from '../../../services/client.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TutorialService } from '../../../services/tutorial.service';
import { VideoService } from '../../../services/video.service';
import { UrlService } from '../../../services/url.service';
import { FileService } from '../../../services/file.service';

import { Url } from '../../../models/url';
import { File } from '../../../models/file';
import { Video } from '../../../models/video';
import { Tutorial } from '../../../models/tutorial';
import { Client } from '../../../models/client';

import { ApiResponse } from '../../../interfaces/api-response';

import { BaseSubPage } from '../../../abstract-classes/base-sub-page';
import {Quiz} from "../../../models/quiz.model";
import {Question} from "../../../models/question.model";
import {QuizService} from "../../../services/quiz.service";
import {NavigationService} from "../../../services/navigation.service";
import { FirebaseModuleService } from '../../../firebase-services/firebase-module.service';
import { FirebaseClientService } from '../../../firebase-services/firebase-client.service';
import {Subscription} from "rxjs/Subscription";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-libraries',
  templateUrl: './page-libraries.component.html',
  styleUrls: ['./page-libraries.component.scss']
})
export class PageLibrariesComponent extends BaseSubPage implements OnInit {
  modules: Array<Module> = [];
  isVideoOpen: Boolean = false;
  activeVideo: String = '';
  offset = 0;
  limit: Number = 0;
  isEditing: Boolean = false;
  modalLoading: Boolean = false;
  modalSuccess: Boolean = false;
  modalFailure: Boolean = false;
  modalResultMessage: String = '';
  loadingStatus: String = '';
  newModuleFormGroup: FormGroup;
  newContentFormGroup: FormGroup;
  newQuizFormGroup: FormGroup;
  contentType = '';
  submitted: Boolean = false;
  clients = [];
  selectedType: any;
  selectedItem: any;
  selectedModule: Module;
  selectedVideo: Video;
  selectedFile: File;
  selectedUrl: Url;
  selectedTutorial: Tutorial;
  quiz: Quiz = new Quiz({});
  subscription: Subscription;
  moduleSubscription : Subscription;

  constructor(
    public moduleService: ModuleService,
    public navigationService: NavigationService,
    public sanitizer: DomSanitizer,
    public themeService: ThemeService,
    public modalService: NgbModal,
    public clientService: ClientService,
    public tutorialService: TutorialService,
    public videoService: VideoService,
    public urlService: UrlService,
    public fileService: FileService,
    public quizService: QuizService,
    private _authenticationService: AuthenticationService,
    private firebaseModuleService: FirebaseModuleService,
    private firebaseClientService: FirebaseClientService,
    private router: Router
  ) {
    super();
    navigationService.isDashboard = true;
  }

  ngOnInit() {
    this.newModule();
    this.getClientModules().then(result => this.getClients());
    this.newModule();
  }

  setQuiz(quiz) {
    this.quiz = quiz;
  }

  addQuestion() {
    this.quiz.questions.push(new Question({}));
  }

  removeQuestion(question) {
    const index = this.quiz.questions.indexOf(question);
    this.quiz.questions.splice(index, 1);
  }

  initDropDownOptions(event, question) {
    if (event.target.value === 'drop-down') {
      question.options = [''];
    } else {
      question.options = [];
    }
  }

  addDropDownOption(question) {
    question.options.push('');
  }

  newView(parent, module, type) {
    this.firebaseModuleService.addViews(module.client._id, module._id,type,parent._id).then(()=>{

    }).catch(()=>{
      console.log('Could not log view'); 
    })
  }

  submitQuiz() {
    this.submitted = true;
    if (this.isValidQuiz()) {
      if (this.quiz && !this.isEditing && this.quiz._id) {
        delete this.quiz._id;
      }
      this.modalLoading = true;
      if (!this.isEditing) {
        this.loadingStatus = 'Adding new quiz...';
        this.firebaseModuleService.addQuiz(this.selectedModule.client._id,
           this.selectedModule._id, this.quiz.type, this.quiz.parent, this.quiz).then((savedQuiz)=>{
             console.log(savedQuiz);  
             let count = 0;
             for(let question of this.quiz.questions) {
              this.firebaseModuleService.addQuestionToQuiz(this.selectedModule.client._id,
                this.selectedModule._id, this.quiz.type, this.quiz.parent,savedQuiz.id, question).then(()=>{
                  count=count+1;
                  if(count == this.quiz.questions.length){
                    this.modalLoading = false;
                    this.modalSuccess = true;
                    this.modalResultMessage = 'Quiz saved successfully';
                  }
                })
             }
             
            
        }).catch((error)=> {
          this.modalLoading = false;
          this.modalFailure = true;
          this.modalResultMessage = error
        })
      } else {
        this.loadingStatus = 'Updating quiz...';
        this.firebaseModuleService.updateQuiz(this.selectedModule.client._id,
          this.selectedModule._id, this.quiz.type, this.quiz.parent,this.quiz._id, this.quiz).then(()=>{
            this.modalLoading = false;
            this.modalSuccess = true;
            this.modalResultMessage = 'Quiz updated successfully';
          }).catch((error)=>{
            this.modalLoading = false;
            this.modalFailure = true;
            this.modalResultMessage = error
          })
      }
    }
  }

  isValidQuiz() {
    if (!this.quiz.title || !this.quiz.type || !this.quiz.passPercentage) {
      return false;
    } else if (this.quiz.passPercentage < 0 || this.quiz.passPercentage > 100) {
      return false;
    }
    for (const question of this.quiz.questions) {
      if (!question.pointValue || !question.content || !question.type || !question.correctAnswer) {
        return false;
      }
      let invalid = false;
      switch (question.type) {
        case 'drop-down': {
          for (const option of question.options) {
            if (!option.length) {
              invalid = true;
            }
          }
          break;
        }
      }
      if (invalid) {
        return false;
      }
    }
    return true;
  }

  changeContentType(type: any) {
    switch (type.target.value) {
      case 'tutorial':
        this.contentType = 'tutorial';
        this.newTutorial();
        break;
      case 'video':
        this.contentType = 'video';
        this.newVideo();
        break;
      case 'file':
        this.contentType = 'file';
        this.newFile();
        break;
      case 'url':
        this.contentType = 'url';
        this.newFile();
        break;
    }
  }

  getRole() {
    return this._authenticationService.user.role || null;
  }

  getClients() {
    if (this._authenticationService.user.role === 'administrator') {
      this.loading = true;
      this.loadingStatus = 'Fetching Clients...';
      this.subscription = this.firebaseClientService.getAllClients().subscribe((clients)=> {
        this.loading = false;
        for (const client of clients) {
          this.clients.push(new Client(client));
        }
      });
    } else {
      this.newModuleFormGroup.patchValue({client: this.clientService.currentClient._id});
    }
  }

  newModule() {
    this.newModuleFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required])
    });
    if (this._authenticationService.user.role !== 'administrator') {
      this.newModuleFormGroup.patchValue({client: this.clientService.currentClient._id});
    }
  }

  newTutorial() {
    this.newContentFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      module: new FormControl('', [Validators.required])
    });
  }

  editTutorial(tutorial) {
    console.log(this.selectedModule);
    this.newContentFormGroup = new FormGroup({
      _id: new FormControl(tutorial._id, [Validators.required]),
      title: new FormControl(tutorial.title, [Validators.required]),
      content: new FormControl(tutorial.content, [Validators.required]),
      module: new FormControl(this.selectedModule._id, [Validators.required]),
      client: new FormControl(this.selectedModule.client._id, [Validators.required])
    });
  }

  newVideo() {
    this.newContentFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      youtubeId: new FormControl('', [Validators.required]),
      module: new FormControl('', [Validators.required])
    });
  }

  newFile() {
    this.newContentFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      module: new FormControl('', [Validators.required])
    });
  }

  submitNewModule() {
    this.submitted = true;
    if (this.newModuleFormGroup.valid) {
      this.modalLoading = true;
      this.loadingStatus = 'Adding new module...';
      if (this._authenticationService.user.role === 'administrator') {
        this.firebaseModuleService.addModule(this.newModuleFormGroup.value.client, this.newModuleFormGroup.value).then(()=>{
          this.modalLoading = false;
          this.modalSuccess = true;
          this.modalResultMessage = 'Module saved successfully'
        }).catch((error)=>{
          this.modalLoading = false;
          this.modalFailure = true;
          this.modalResultMessage = error;
        })
      }
    }
  }

  submitEditContentItem() {
    this.submitted = true;
    if (this.newContentFormGroup.valid) {
      this.modalLoading = true;
      this.loadingStatus = 'Updating Content Item...';
      switch (this.contentType) {
        case 'tutorial':
          this.submitEditTutorial();
          break;
      }
    }
  }

  submitNewContentItem() {
    this.submitted = true;
    this.newContentFormGroup.patchValue({module: this.selectedModule});
    if (this.newContentFormGroup.valid) {
      this.modalLoading = true;
      this.loadingStatus = 'Adding Content Item...';
      switch (this.contentType) {
        case 'tutorial':
          this.submitTutorial();
          break;
        case 'video':
          this.submitVideo();
          break;
        case 'file':
          this.submitFile();
          break;
        case 'url':
          this.submitUrl();
          break;
      }
    }
  }

  submitTutorial() {
    const body = {
      title: this.newContentFormGroup.controls['title'].value,
      content: this.newContentFormGroup.controls['content'].value,
      module: this.newContentFormGroup.controls['module'].value._id,
      client: this.newContentFormGroup.controls['module'].value.client._id,
    };
    this.firebaseModuleService.addTutorial(body.client, body.module, body).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      const index = this.modules.indexOf(this.selectedModule);
    }).catch((error)=>{
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
  }

  submitEditTutorial() {
    const body = {
      title: this.newContentFormGroup.controls['title'].value,
      content: this.newContentFormGroup.controls['content'].value,
      module: this.newContentFormGroup.controls['module'].value,
      client: this.newContentFormGroup.controls['client'].value
    };
    this.firebaseModuleService.updateTutorial(body.client, body.module,
      this.newContentFormGroup.controls['_id'].value, body ).then(()=>{
        this.modalLoading = false;
        this.modalSuccess = true;
        this.modalResultMessage = 'Tutorial updated successfully';
      }).catch((error)=>{
        this.modalLoading = false;
        this.modalFailure = true;
        this.modalResultMessage = error
      })
  }

  submitVideo() {
    let youtubeId;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = this.newContentFormGroup.controls['youtubeId'].value.match(regExp);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    } else {
      youtubeId = this.newContentFormGroup.controls['youtubeId'].value;
    }
    const body = {
      title: this.newContentFormGroup.controls['title'].value,
      youtubeId: youtubeId,
      module: this.newContentFormGroup.controls['module'].value._id,
      client: this.newContentFormGroup.controls['module'].value.client._id,
    };
    this.firebaseModuleService.addVideo(body.client, body.module, body).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      const index = this.modules.indexOf(this.selectedModule);
    }).catch((error)=>{
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error.error.message;
    })
  }

  submitUrl() {
    const body = {
      title: this.newContentFormGroup.controls['title'].value,
      url: this.newContentFormGroup.controls['url'].value,
      module: this.newContentFormGroup.controls['module'].value._id,
      client: this.newContentFormGroup.controls['module'].value.client._id,
    };
    this.firebaseModuleService.addUrls(body.client, body.module, body).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'URL added successfully';
    }).catch((error)=> {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
  }

  submitFile() {
    const body = {
      title: this.newContentFormGroup.controls['title'].value,
      url: this.newContentFormGroup.controls['url'].value,
      module: this.newContentFormGroup.controls['module'].value._id,
      client: this.newContentFormGroup.controls['module'].value.client._id,
    };
    this.fileService.newFile(body).subscribe((result: ApiResponse) => {
      this.modalLoading = false;
      this.modalSuccess = true;
      const index = this.modules.indexOf(this.selectedModule);
      this.modules[index].files.push(new File(result.data));
      this.modalResultMessage = result.message;
    }, error => {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error.error.message;
    });
  }

  removeModule() {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.selectedModule.title + '...';
    this.firebaseModuleService.deleteModule(this.selectedModule.client._id, this.selectedModule._id).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'Module Removed Successfully';
    }).catch((error)=>{
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
  }

  removeVideo(module) {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.selectedVideo.title + '...';
    this.firebaseModuleService.deleteVideo(module.client._id, module._id, this.selectedVideo._id).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'Video deleted successfully';
    }).catch((error)=> {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
    
  }

  removeFile(module) {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.selectedFile.name + '...';
    this.fileService.removeFile(this.selectedFile._id, module.client._id).subscribe((result: ApiResponse) => {
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = result.message;
      const index = module.files.indexOf(this.selectedFile);
      module.files.splice(index, 1);
    }, error => {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error.error.message;
    });
  }

  removeUrl(module) {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.selectedUrl.title + '...';
    this.firebaseModuleService.deleteUrl(module.client._id, module._id, this.selectedUrl._id).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'URL deleted successfully';
    }).catch((error)=> {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
    
  }

  removeTutorial(module) {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.selectedTutorial.title + '...';

    this.firebaseModuleService.deleteTutorial(module.client._id, module._id, this.selectedTutorial._id).then(()=>{
      this.modalLoading = false;
      this.modalSuccess = true;
      this.modalResultMessage = 'Tutorial deleted successfully';
    }).catch((error)=> {
      this.modalLoading = false;
      this.modalFailure = true;
      this.modalResultMessage = error;
    })
    
  }

  removeQuiz(parent, selectedType) {
    this.modalLoading = true;
    this.loadingStatus = 'Deleting ' + this.quiz.title + '...';
    this.quiz.parent = parent._id;
    let selectedObj;
   
    this.firebaseModuleService.deleteQuiz(this.selectedModule.client._id, this.selectedModule._id,
      selectedType, parent._id, this.quiz._id).then(()=>{
        this.modalLoading = false;
        this.modalSuccess = true;
        this.modalResultMessage = 'Quiz Removed Successfully';
      }).catch((error)=>{
        this.modalLoading = false;
        this.modalFailure = true;
        this.modalResultMessage = error;
      })
  }

  clearModal() {
    this.modalFailure = false;
    this.modalSuccess = false;
    this.modalLoading = false;
    this.loadingStatus = '';
    this.submitted = false;
  }

  clearContent() {
    this.isEditing = false;
    this.clearModal();
    this.contentType = '';
    this.newContentFormGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  clearModule() {
    this.clearModal();
    this.newModuleFormGroup.patchValue({title: ''});
  }

  clearQuiz() {
    this.clearModal();
    this.quiz = new Quiz({});
  }

  deleteOption(options, index) {
    options.splice(index, 1);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  getClientModules() {
    return new Promise(resolve => {
      this.loading = true;
      this.loadingStatus = 'Fetching Modules';
      let moduleObservable: Observable<any>;
      if(this._authenticationService.user.role == 'administrator') {
        this.moduleSubscription = this.firebaseModuleService.getAllModules().subscribe((clients)=> {
          this.modules = [];
          for(let client of clients) {
            if(client.modules && client.modules[0] == undefined) {
              client.modules = [];
            }
            for (const module of client.modules) {
              if(module.tutorials) {
                if(module.tutorials.length>0 && module.tutorials[0] == undefined) {
                  module.tutorials = [];
                }
              }
              if(module.videos) {
                if(module.videos.length>0 && module.videos[0] == undefined) {
                  module.videos = [];
                }
              }
              if(module.urls) {
                if(module.urls.length>0 && module.urls[0] == undefined) {
                  module.urls = [];
                }
              }
              module.client = client;
              this.modules.push(module);
            }
          }
          this.loading = false;
          resolve();
        })
      } else if(this._authenticationService.user.role == 'client' || 
      this._authenticationService.user.role == 'user') {
        this.firebaseClientService.getCurrentClient(this._authenticationService.user.client_id).subscribe((client)=>{
          this.moduleSubscription = this.firebaseModuleService.getModules(this._authenticationService.user.client_id)
          .subscribe((modules)=> {
            this.modules = [];
            if(modules && modules[0] == undefined) {
              modules = [];
            }
            for (const module of modules) {
              if(module.tutorials) {
                if(module.tutorials.length>0 && module.tutorials[0] == undefined) {
                  module.tutorials = [];
                }
              }
              if(module.videos) {
                if(module.videos.length>0 && module.videos[0] == undefined) {
                  module.videos = [];
                }
              }
              if(module.urls) {
                if(module.urls.length>0 && module.urls[0] == undefined) {
                  module.urls = [];
                }
              }
              module.client = client;
              this.modules.push(module);
            }
            this.loading = false;
            resolve();
          });
        })
      }
     
      
    });
  }

  navigateToUrl(url) {
    window.open(url, '_blank');
  }

  open(content) {
    this.modalService.open(content);
  }

  gotoQuiz(quizDetails, type) {
    if(type == 'video') {
      type = 'videos';
    }
    if(type == 'url') {
      type = 'urls';
    }
    if(type == 'tutorial') {
      type = 'tutorials';
    }
    this.router.navigate(['/dashboard/quizzes/'+quizDetails.quiz._id], { queryParams: { client: this.selectedModule.client._id,
    module: this.selectedModule._id, type: type, type_id: quizDetails._id } } )
  }

  gotoTutorial(tutorial, module) {
    
    this.router.navigate(['/dashboard/tutorials/'+tutorial._id], { queryParams: { client: module.client._id,
    module: module._id} } )
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.moduleSubscription) {
      this.moduleSubscription.unsubscribe();
    }
  }

}
