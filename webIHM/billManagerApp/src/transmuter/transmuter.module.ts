import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StructurerModule} from '../structurer/structurer.module';
import {PtConfModule} from '../pt-conf/pt-conf.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import {AlertDisplayerService} from '../alert-displayer.service';
import {LogMessageComponent} from '../log-message/log-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class TransmuterModule {
  private listeTaches : any;
  private listeStories : any;
  private listeProjets : any;

  constructor(private config : PtConfModule, private http : HttpClient,private Structurer : StructurerModule,private alerter : LogMessageComponent){
		//this.formatConf = conf;
		this.listeTaches = undefined;
		this.listeStories = undefined;
		this.listeProjets = undefined;
  }
  

  public transmuteTasks(TaskObject){
    let finalListOfObjects = [];
      console.log("transmuting tasks");
		  let tasksStructure;
        //Boucle sur object configConverterTasks
	  		for(let u in TaskObject){	
		  		let finalObjects = {};
         	for(let i  in this.config.ConverterTasks){
         		if(TaskObject[u][i] !== undefined){
         			finalObjects[this.config.ConverterTasks[i]] = TaskObject[u][i];      			
        		}      			
         	}	
        	finalListOfObjects.push(finalObjects);
	  		}
        this.listeTaches = finalListOfObjects;
        return finalListOfObjects;
	}

	public transmuteStories(StoryObject){
    let finalListOfObjects = [];
    console.log('StoryObject', StoryObject)
      console.log("Transmuting Stories");
		  let storyStructure;  		
      //Boucle sur object config
			for(let u in StoryObject){   
        let finalObjects = {};
      			for(let i in this.config.ConverterStories){
      				if(StoryObject[u][this.config.ConverterStories[i]] !== undefined){
      					finalObjects[i] = StoryObject[u][this.config.ConverterStories[i]];      			
      				}      			
      			}
      	finalListOfObjects.push(finalObjects);	
			}
			this.listeStories = finalListOfObjects;
      return finalListOfObjects;
	}

	public transmuteProjects(ProjectsObjects){
    //obj bdd
    let finalListOfObjects = [];
    console.log("Transmuting Projects");
    let projectStructure;
    //Boucle sur object config
			for(let u in ProjectsObjects){
				let finalObjects = {};
      			for(let i  in this.config.ConverterProjet){
      				if(ProjectsObjects[u][this.config.ConverterProjet[i]] !== undefined){
      					finalObjects[i] = ProjectsObjects[u][this.config.ConverterProjet[i]];      			
      				}      			
      			}
      			finalListOfObjects.push(finalObjects);	
			}
      this.listeProjets = finalListOfObjects;
      return finalListOfObjects;
	}

	public encapsulateObjects(projects,stories,tasks,isFactu)
  {
    let GeneralObject : any = {};
    	if( projects != undefined && stories != undefined && tasks != undefined)
      {
    		GeneralObject.projets = projects;
    		for(let p in GeneralObject.projets){
          GeneralObject.projets[p].Stories = stories.filter(o => o.Fk_Project == GeneralObject.projets[p].ID);
          for(let t in GeneralObject.projets[p].Stories){
            GeneralObject.projets[p].Stories[t].Tasks = tasks.filter(o => o.FK_Stories == GeneralObject.projets[p].Stories[t].OriginalId);
          }
        }
      this.sendToServer(GeneralObject,isFactu);
    	}
  }


  public Angularget(configUrl,objetAEnvoyer) {
    return this.http.post(configUrl,objetAEnvoyer, {
      headers: {
        "dataType" :  "json",
        "Content-Type" :"application/json; charset=UTF-8"
      }
    });
  }

  public sendToServer(GeneralObject,isFactu){
    if(isFactu){
      console.log("sending object : ", GeneralObject);
    this.Angularget('http://localhost/DevisAPI/api/Facturation/',JSON.stringify(GeneralObject)).toPromise().then((res) => {
      this.alerter.setlogMessage("Process Terminé :)");
      console.log("terminé ! ");
      this.alerter.setLoadingProperty();
    }).catch((error) => {
      this.alerter.setlogMessage("Il y a eu une erreur");
      this.alerter.setLoadingProperty();
      console.log("Il y a eu une erreur");
    });
    }else{
      console.log("sending object : ", GeneralObject);
    this.Angularget('http://localhost/DevisAPI/api/Devis/',JSON.stringify(GeneralObject)).toPromise().then((res) => {
      this.alerter.setlogMessage("Process Terminé :)");
      console.log("terminé ! ");
      this.alerter.setLoadingProperty();
    }).catch((error) => {
      this.alerter.setlogMessage("Il y a eu une erreur");
      this.alerter.setLoadingProperty();
      console.log("Il y a eu une erreur");
    });
    }
  }
 }
