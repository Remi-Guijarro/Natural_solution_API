import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css'],
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  private devisScope;
  private factureScope;
  constructor(private epicRecuperator : EpicRecuperatorModule, private http: HttpClient) {
    this.divVisibility = false; 
    this.DevisProcessLauched = false;
   }

  ngOnInit() {
    this.devisScope = document.getElementById('devis');
    this.factureScope = document.getElementById('facture');
  }

  displayOptions () :void {
    if(this.divVisibility == false){
      this.devisScope.style.visibility = "visible";
      this.factureScope.style.visibility = "visible";
      this.divVisibility = true;
    }else{
      this.devisScope.style.visibility = "hidden";
      this.factureScope.style.visibility = "hidden";
      this.divVisibility = false;
    }
  } 

  lauchDevis() :void {
    let infoLogContext = document.getElementById('infoLog');
    if(this.DevisProcessLauched == false){      
      infoLogContext.style.visibility = "visible";
      infoLogContext.innerHTML = "<p> Devis process lauched </p>"
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
      this.DevisProcessLauched = true;
      let objetTransition;
      this.epicRecuperator.getAllProjectsId().then(projects => {
        console.log("res",projects);
        this.epicRecuperator.getAllEpics(projects).then(epics => {
          let selector = document.createElement("select");
          selector.style.borderRadius = "15px";
          selector.style.padding = "10px"; 
          selector.style.position = " relative";
          selector.style.top = "2em";          
          for(let i in epics){
            let option = document.createElement("option");
            option.text = epics[i];
            selector.appendChild(option);
           }
           let fileGeneratorContext = document.getElementById('fileGenerator');
           fileGeneratorContext.appendChild(selector);
        });
      
        // let promises: Promise<any[]>[] = [];
        // projects.forEach(project => {
        //   let promise: Promise<any[]> = this.http.get<any[]>('')
        //   .toPromise()
        //   .then(stories => {
        //     //stories iterations
        //     project.stories = stories;


        //     return stories;


        //   }, error => {
        //     project.stories = [];
        //     return [];
        //   })
        //   .then(stories => {
        //     return stories;
        //   });

        //   promises.push(promise);
        // });
        // Promise.all(promises).then(success => {

        // }, error => {

        // });
      });
    }else{
      infoLogContext.innerHTML = "<p> Keep Calm and take a coffee, Devis process is already processing !"
      infoLogContext.style.visibility = "visible";
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
    }
    
  }

}
