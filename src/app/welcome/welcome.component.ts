import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @ViewChild('name') nameKey!: ElementRef;
  constructor(private router: Router) {
    this.selectedOption = this.options[0];
    localStorage.setItem("opval",this.selectedOption);
  }
  selectedOption!: string;
  options: string[] = ['Synonyms', 'Antonyms', 'Direct-Indirect', 'Prepositions',
  'Idioms', 'General'];
  ngOnInit(): void {
  }
  startQuiz(){
    var name=this.nameKey.nativeElement.value;
     if (name.trim().length !== 0) {
      localStorage.setItem("name",name);
     this.router.navigateByUrl('/question');
    }
  }
  onItemChange(value: any){
    localStorage.setItem("opval",value);
    this.selectedOption =value;
 }
}
