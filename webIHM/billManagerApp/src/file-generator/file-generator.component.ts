import { Component, OnInit } from '@angular/core';
import { EpicRecuperatorModule } from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';
import { DevisRequesterModule } from '../devis-requester/devis-requester.module';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { LogMessageComponent } from '../log-message/log-message.component';
import * as moment from 'moment';
import { TransmuterModule } from "../transmuter/transmuter.module";
import { resolve } from 'q';
import { $ } from 'protractor';
import { AlertDialogService } from 'src/services/alert-dialog.service';
import { ViewChild } from '@angular/core';
import { Injectable, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css']
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  private devisScope;
  private factureScope;
  private fileScope;
  public tarifications;
  private initialInexistante;
  private compteurRessource = 0;
  private currentRessource;
  private modalRessourceRef; 
  private nbRessourceAAjouter;

  heroForm = new FormGroup ({
    name: new FormControl(),
    email : new FormControl(),
    initial : new FormControl(),
    niveau : new FormControl(),
    Tarification : new FormControl()
  });

  constructor(private alertSrv: AlertDialogService, private epicRecuperator: EpicRecuperatorModule, private http: HttpClient, private devisRequester: DevisRequesterModule, private alerter: LogMessageComponent, private myTransMuter: TransmuterModule, private modalService: NgbModal) {
    this.divVisibility = false;
    this.DevisProcessLauched = false;
  }

  ngOnInit() {
    this.devisScope = document.getElementById('devis');
    this.factureScope = document.getElementById('facture');
    this.fileScope = document.getElementById('fileGenerator');
  }

  private expanded = false;
  private storiesSansEpics;

  setcurrentRess() {
    console.log("this.compteurRessource",this.compteurRessource);
    if (this.compteurRessource < this.initialInexistante.length-1) {
      this.compteurRessource = this.compteurRessource + 1;
      this.currentRessource = this.initialInexistante[this.compteurRessource];
      this.nbRessourceAAjouter = this.nbRessourceAAjouter-1;
    }else{
      this.modalRessourceRef.close();
    }
  }

  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    } else {
      checkboxes.style.display = "none";
      this.expanded = false;
    }
  }



  postNewRessource(url, objetAEnvoyer) {
    return this.http.post(url, objetAEnvoyer, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }

  displayOptions(): void {
    if (this.divVisibility == false) {
      this.fileScope.style.visibility = "visible";
      this.devisScope.style.visibility = "visible";
      this.factureScope.style.visibility = "visible";
      this.divVisibility = true;
    } else {
      this.fileScope.style.visibility = "hidden";
      this.devisScope.style.visibility = "hidden";
      this.factureScope.style.visibility = "hidden";
      this.divVisibility = false;
    }
  }

  @ViewChild('templateRessourceModal') templateRessourceModal: NgbModalRef;
  @ViewChild('treatmentStories') templateStoriesModal: NgbModalRef;
  @ViewChild('ajoutRessources') ajoutRessources: NgbModalRef;

  setModalStoriesSansEpics() {
    let modalRef = this.modalService.open(this.templateStoriesModal);
    return modalRef;
  }

  setModalRessourcesInexistante() {
    let modalRef = this.modalService.open(this.templateRessourceModal);
    return modalRef;
  }

  setModalAjoutRessource() {
    let modalRef = this.modalService.open(this.ajoutRessources);
    this.modalRessourceRef = modalRef;
    return modalRef;
  }

  get(url) {
    return this.http.get(url, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }

  // verifyInitial(taches) {
  //   return new Promise((resolve, reject) => {
  //     this.setModalRessourcesInexistante();
  //     let initialEmployes = [];
  //     this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res) => {
  //       for (let emp in res) {
  //         console.log("res[emp].Initial", res[emp].Initial);
  //         initialEmployes.push(res[emp].Initial)
  //       }
  //       let initialInexistante = new Set();
  //       for (let currentTasks in taches) {
  //         if (taches[currentTasks].Initials.length > 2) {
  //           let owners = taches[currentTasks].Initials.split("+");
  //           for (let currentOwner in owners) {
  //             if (!initialEmployes.includes(owners[currentOwner])) {
  //               initialInexistante.add(owners[currentOwner]);
  //             }
  //           }
  //         } else {
  //           if (!initialEmployes.includes(taches[currentTasks].Initials)) {
  //             initialInexistante.add(taches[currentTasks].Initials);
  //           }
  //         }
  //       }
  //       let initialInexistanteArray = Array.from(initialInexistante);
  //       if (initialInexistanteArray.length > 0) {
  //         this.get('http://localhost/DevisAPI/api/tarification/').toPromise().then((res) => {
  //           this.tarifications = res;
  //           let tailleInitialP = document.getElementById('taille_init');
  //           let tailleInitialInexistanteTemp = 0;
  //           tailleInitialP.innerHTML = initialInexistanteArray.length.toString();
  //           let divChoixPbInitial = document.getElementById('choixInitialInexistante');
  //           divChoixPbInitial.style.visibility = "visible";
  //           let buttonAjoutRessource = document.getElementById('ajouterInitial');
  //           let buttonEnvoiRessource = document.getElementById('validation_NewRessource');
  //           let inputInitials = document.getElementById('Initial_NewRessource') as HTMLInputElement;
  //           inputInitials.value = initialInexistanteArray[tailleInitialInexistanteTemp];
  //           console.log("initialInexistanteArray[0]", initialInexistanteArray[0])

  //           buttonEnvoiRessource.onclick = () => {
  //             console.log("tailleInitialInexistanteTemp", tailleInitialInexistanteTemp);
  //             let : any = {};
  //             let inputName = document.getElementById('Nom_Prenom_NewRessource') as HTMLInputElement;
  //             .Name = inputName.value;

  //             let inputMail = document.getElementById('Mail_NewRessource') as HTMLInputElement;
  //             .Mail = inputMail.value;
  //             console.log("initialInexistanteArray[tailleInitialInexistanteTemp-1]", initialInexistanteArray[tailleInitialInexistanteTemp]);
  //             .Initial = inputInitials.value;

  //             let inputNiveau = document.getElementById('Niveau_NewRessource') as HTMLSelectElement;
  //             .niveau = inputNiveau.value;

  //             let checkboxesTarification = document.getElementsByClassName('checkboxes_tarif') as HTMLCollectionOf<HTMLInputElement>;

  //             .tarification = "";
  //             for (let c in checkboxesTarification) {
  //               console.log('checkboxesTarification.value', checkboxesTarification[c]);
  //               if (checkboxesTarification[c].checked && checkboxesTarification[c].id != undefined) {
  //                 .tarification += checkboxesTarification[c].id + ";";
  //               }
  //             }

  //             .tarification = .tarification.substring(0, .tarification.length - 1);
  //             console.log(".tarification", .tarification);
  //             .tarification = .tarification.split(';');

  //             if (.Name == undefined || .Mail == undefined || .Initial == undefined || .niveau == "" || .tarification == "" || .tarification == undefined) {
  //               console.log(".Name", .Name);
  //               console.log(".Mail", .Mail);
  //               console.log(".Initial", .Initial);
  //               this.alerter.setlogMessage('tout les champs doivent être remplies');
  //             } else {
  //               console.log('tailleInitialInexistanteTemp', tailleInitialInexistanteTemp);
  //               inputName.value = "";
  //               inputMail.value = "";
  //               inputNiveau.value = "3";
  //               for (let checkbox in checkboxesTarification) {
  //                 if (checkboxesTarification[checkbox].id != undefined) {
  //                   checkboxesTarification[checkbox].checked = false;
  //                 }
  //               }
  //               console.log("", );
  //               this.postNewRessource('http://localhost/DevisAPI/api/', ).toPromise().then(() => {
  //                 this.alerter.setlogMessage('Ressource ajouté à la base');
  //               })
  //               tailleInitialInexistanteTemp++;
  //               tailleInitialP.innerHTML = (initialInexistanteArray.length - tailleInitialInexistanteTemp).toString();
  //               let inputInitials = document.getElementById('Initial_NewRessource') as HTMLInputElement;
  //               inputInitials.value = initialInexistanteArray[tailleInitialInexistanteTemp];
  //               if (tailleInitialInexistanteTemp >= initialInexistanteArray.length) {
  //                 this.alerter.hideClosableAlert();
  //                 resolve(true);
  //               }
  //             }
  //           };

  //           buttonAjoutRessource.onclick = () => {
  //             document.getElementById('inital_info').style.visibility = "hidden";
  //             document.getElementById('ajoutRessource').style.visibility = "visible";
  //           };
  //           this.alerter.setClosableAlert(divChoixPbInitial);
  //         })
  //       } else {
  //         resolve(true);
  //       }
  //     });
  //   });
  // }


  verifyInitial(taches) {
    return new Promise((resolve, reject) => {
      let initialEmployes = [];
      this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res) => {
        for (let emp in res) {
          console.log("res[emp].Initial", res[emp].Initial);
          initialEmployes.push(res[emp].Initial)
        }
        let initialInexistante = new Set();
        for (let currentTasks in taches) {
          if (taches[currentTasks].Initials.length > 2) {
            let owners = taches[currentTasks].Initials.split("+");
            for (let currentOwner in owners) {
              if (initialEmployes.includes(owners[currentOwner])) {
                initialInexistante.add(owners[currentOwner]);
              }
            }
          } else {
            if (initialEmployes.includes(taches[currentTasks].Initials)) {
              initialInexistante.add(taches[currentTasks].Initials);
            }
          }
        }
        let initialInexistanteArray = Array.from(initialInexistante);
        if (initialInexistanteArray.length > 0) {
          this.get('http://localhost/DevisAPI/api/tarification/').toPromise().then((res) => {
            this.tarifications = res;
            this.initialInexistante = Array.from(initialInexistante);
            this.currentRessource = this.initialInexistante[0];
            this.nbRessourceAAjouter = this.initialInexistante.length;
            this.setModalRessourcesInexistante().result.then(() => {
              let n = this.modalRessourceRef as NgbModalRef;
              n.result.then(() => {
                resolve(true);
              })
            });
          })
        } else {
          resolve(true);
        }
      });
    });
  }



  lauchProcess(type: any): void {
    let infoLogContext = document.getElementById('infoLog');
    if (this.DevisProcessLauched == false) {
      let processLauchMessage = {
        title: "Process Lauched",
        content: "Process " + type + " Lauched"
      }
      this.alertSrv.open(processLauchMessage)
      this.DevisProcessLauched = true;
      let objetTransition;
      // this.alerter.setLoadingProperty();
      this.epicRecuperator.getAllProjectsId().then(projects => {
        this.epicRecuperator.getAllEpics(projects).then(epics => {
          let selector = document.createElement("select");
          selector.style.borderRadius = "15px";
          selector.style.padding = "10px";
          selector.style.position = "absolute";
          selector.style.bottom = "100px";
          selector.style.left = "50%";
          selector.style.transform = "translateX(-50%)";
          selector.style.width = "30%";

          for (let i in epics) {
            let option = document.createElement("option");
            option.text = epics[i];
            selector.appendChild(option);
          }
          let fileGeneratorContext = document.getElementById('fileGenerator');
          fileGeneratorContext.appendChild(selector);
          //     this.alerter.setLoadingProperty();
          selector.onchange = () => {
            if (type.toLowerCase() == "devis") {
              let projets = this.devisRequester.getProjectFromEpic(projects, selector.value);
              let zeubi = this.myTransMuter.transmuteProjects(projets);
              let transformedProject = zeubi;
              this.devisRequester.getProjectStories(projets).then((rezzz) => {
                console.log(rezzz);
                let race = this.myTransMuter.transmuteStories(rezzz.stories);
                let transformedStories = race;
                console.log("transformedStories", transformedStories);
                this.devisRequester.getTasks(rezzz.stories, projects, false).then((rez) => {
                  console.log(rez.Taches);
                  let couilles = this.myTransMuter.transmuteTasks(rez.Taches)
                  let transformedTasks = couilles;
                  this.verifyInitial(couilles).then((retour) => {
                    if (retour) {
                      this.myTransMuter.encapsulateObjects(transformedProject, transformedStories, transformedTasks, false, 0, 0);
                      console.log('envoir en cours');
                    }
                  })
                });
              })

            } else if (type.toLowerCase() == "facture") {
              let monthPicker = document.createElement('input');
              monthPicker.type = "month";
              monthPicker.id = "month";
              monthPicker.pattern = '[0-9]{4}/[0-9]{2}';
              monthPicker.style.borderRadius = "15px";
              monthPicker.style.padding = "10px";
              monthPicker.style.position = "absolute";
              monthPicker.style.bottom = "40px";
              monthPicker.style.left = "50%";
              monthPicker.style.transform = "translateX(-50%)";
              monthPicker.style.width = "25%";
              fileGeneratorContext.appendChild(monthPicker);
              monthPicker.onchange = () => {
                //           this.alerter.setLoadingProperty();
                let projets = this.devisRequester.getProjectFromEpic(projects, selector.value);
                console.log('projets', projets);
                let projetmidified = this.myTransMuter.transmuteProjects(projets);
                this.devisRequester.getAcceptedProjectStories(this.devisRequester.getProjectFromEpic(projets, selector.value), monthPicker.value).then((resFactu) => {

                  this.myTransMuter.transmuteStories(resFactu);
                  let ProperStories = [];
                  for (let z in resFactu.stories) {
                    if (resFactu.stories[z].labels != undefined) {
                      if (resFactu.stories[z].labels.includes('bonus')) {
                        resFactu.stories[z].nonEffetue = false;
                        ProperStories.push(resFactu.stories[z]);
                      } else {
                        resFactu.stories[z].nonEffetue = false;
                        ProperStories.push(resFactu.stories[z]);
                      }
                    }
                  }
                  this.devisRequester.getProjectStories(projects).then((e: any) => {
                    for (let cpt in e.stories) {
                      if (e.stories[cpt].current_state != "accepted") {
                        console.log("e[cpt]", e[cpt]);
                        e.stories[cpt].nonEffetue = true;
                        ProperStories.push(e.stories[cpt]);
                      }
                    }
                    let stories = this.myTransMuter.transmuteStories(ProperStories);
                    let storiesmodified = stories;
                    console.log("TRANSMUTED STORIES", stories);
                    if (ProperStories.length > 0) {
                      this.devisRequester.getTasks(ProperStories, projects, true).then((properTasks) => {
                        console.log("properTasks", properTasks.Taches);
                        let taches = this.myTransMuter.transmuteTasks(properTasks.Taches);
                        let tachemodified = taches;
                        let initialEmployes = []
                        this.verifyInitial(taches).then((retour) => {
                          if (retour) {
                            console.log('transformed tâches', taches);
                            this.get("http://localhost/DevisAPI/api/parametres/").toPromise().then((params: any) => {
                              let cdp: HTMLInputElement = <HTMLInputElement>document.getElementById("cdp");
                              cdp.value = params.NbJourCDP;
                              let dt: HTMLInputElement = <HTMLInputElement>document.getElementById("dt");
                              dt.value = params.NbJourDT;
                              let DTCDP = document.getElementById("DTCDP");
                              DTCDP.style.display = "block";
                              let btnEnvoi = document.getElementById('sendObject');
                              btnEnvoi.onclick = (() => {
                                if (cdp.value != '0' || dt.value != '0') {
                                  console.log("cdp dt ", document.getElementById("cdp").textContent + "    " + document.getElementById("dt").textContent)
                                  this.myTransMuter.encapsulateObjects(projetmidified, storiesmodified, tachemodified, true, cdp.value, dt.value);
                                  console.log('j\'envoi !');
                                } else {
                                  this.alerter.setlogMessage('tous les champs doivent être remplis ! ')
                                }
                              })
                            })
                          }
                        });
                      });
                    }
                  });
                }).catch((treatmeantStoriesWithoutEpics) => {
                  console.log("treatmeantStoriesWithoutEpics", treatmeantStoriesWithoutEpics);
                  this.storiesSansEpics = treatmeantStoriesWithoutEpics.storiesSansEpics;
                  this.setModalStoriesSansEpics().result.then(() => {
                    let ProperStories = [];
                    for (let z in treatmeantStoriesWithoutEpics.stories) {
                      if (treatmeantStoriesWithoutEpics.stories[z].labels != undefined) {
                        if (treatmeantStoriesWithoutEpics.stories[z].labels.includes('bonus')) {
                          treatmeantStoriesWithoutEpics.stories[z].nonEffetue = false;
                          ProperStories.push(treatmeantStoriesWithoutEpics.stories[z]);
                        } else {
                          treatmeantStoriesWithoutEpics.stories[z].nonEffetue = false;
                          ProperStories.push(treatmeantStoriesWithoutEpics.stories[z]);
                        }
                      }
                    }
                    this.devisRequester.getProjectStories(projects).then((e: any) => {
                      for (let cpt in e.stories) {
                        if (e.stories[cpt].current_state != "accepted") {
                          console.log("e[cpt]", e[cpt]);
                          e.stories[cpt].nonEffetue = true;
                          ProperStories.push(e.stories[cpt]);
                        }
                      }
                      let stories = this.myTransMuter.transmuteStories(ProperStories);
                      let storiesmodified = stories;
                      console.log("TRANSMUTED STORIES", stories);
                      if (ProperStories.length > 0) {
                        this.devisRequester.getTasks(ProperStories, projects, true).then((properTasks) => {
                          console.log("properTasks", properTasks.Taches);
                          let taches = this.myTransMuter.transmuteTasks(properTasks.Taches);
                          let tachemodified = taches;
                          this.verifyInitial(taches).then((retour) => {
                            if (retour) {
                              this.get("http://localhost/DevisAPI/api/parametres/").toPromise().then((params: any) => {
                                console.log('transformed tâches', taches);
                                let DTCDP = document.getElementById("DTCDP");
                                DTCDP.style.display = "block";
                                let cdp: HTMLInputElement = <HTMLInputElement>document.getElementById("cdp");
                                cdp.value = params.NbJourCDP;
                                let dt: HTMLInputElement = <HTMLInputElement>document.getElementById("dt");
                                dt.value = params.NbJourDT;
                                let btnEnvoi = document.getElementById('sendObject');
                                btnEnvoi.onclick = (() => {

                                  if (cdp.value != '0' || dt.value != '0') {
                                    console.log("cdp dt ", document.getElementById("cdp").textContent + "    " + document.getElementById("dt").textContent)
                                    this.myTransMuter.encapsulateObjects(projetmidified, storiesmodified, tachemodified, true, cdp.value, dt.value);
                                    console.log('j\'envoi !');
                                  } else {
                                    this.alerter.setlogMessage('tous les champs doivent être remplis ! ')
                                  }
                                })
                              });
                            }
                          });
                        });
                      }
                    });
                  }).catch(() => {
                    location.reload();
                  });
                });
              }
            }
          };

        });
      });
    } else {
    }

  }

}
