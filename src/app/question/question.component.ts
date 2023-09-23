import { Component, Inject,OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})

export class QuestionComponent implements OnInit {

  public name: string = "";
  public subcode: string = "";
  public std: string = "";
  public usrts: number = 0;
  public postdata: string = "";
  public questionList: any = [];
  public myList:any = [];
  public chkList:any = [];
  public userList:any = [];
  public ansMap:any = [];
  public pdfURL:any ;
  public retUsrstr:any; 
  isShow = false;
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted : boolean = false;
  constructor(private questionService: QuestionService) {
  }
  elem:any;


  ngOnInit(): void {
    this.elem = document.documentElement;
    this.name=localStorage.getItem("name")!;
    this.subcode=localStorage.getItem("opval")!;
    if(this.name.includes("-")){
    this.std ="";
    const myArray = this.name.split("-");
    this.name =myArray[0] ;
    this.std =myArray[1] ;
    }
    this.getAllQuestions();
    setTimeout(() => {
    if(this.questionList.length===0){
      this.isQuizCompleted = true;
    }else{
    this.startCounter();}
   }, 2000);
  }

  getAllQuestions() {
    this.questionService.getQuestionJson(this.subcode)
      .subscribe(res => {
        this.questionList = res.questions;
     })
  }

  postAnswers() {
    //this.postdata = currentQno+":"+option;
    this.questionService.sendPostRequest(this.ansMap)
      .subscribe(res => {
        debugger;
         this.retUsrstr=res;
      })
  }

  nextQuestion(currentQno: number) {
    if(currentQno >= this.questionList.length){
      this.usrts=new Date().getTime();
      var usrobj = {user: this.name, val: this.usrts};
      this.userList.push(usrobj);
      this.ansMap={"answers":this.myList,"user":this.userList};
      this.postAnswers();
      this.isQuizCompleted = true;
      this.stopCounter();
    }else{
      this.currentQuestion++;
      }
   }
  previousQuestion() {
    this.currentQuestion--;
  }
  answer(currentQno: number, option: any) {
    var cqno=this.questionList[currentQno-1].questionId;
    var ansobj = {qNo:  ""+ cqno+ "", ans: ""+ option.option_id+ ""};
    let recadded=false;
  if(!this.chkList.includes(cqno)){
    this.myList.push(ansobj);
    recadded=true;
  }else{
    alert("One answer allowed")
  }
    this.chkList.push(cqno);
    if (option.correct && recadded) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);


    } else if(!option.correct && recadded){
      setTimeout(() => {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);

      this.points -= 10;
     }

     if(currentQno >= this.questionList.length){
      this.usrts=new Date().getTime();
      var usrobj = {user: this.name, val: this.usrts};
      this.userList.push(usrobj);
      this.ansMap={"answers":this.myList,"user":this.userList};
      this.postAnswers();
      setTimeout(() => {
      this.isQuizCompleted = true;
      this.stopCounter();
    }, 1000);
    }
    }
  startCounter() {
     this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          var qno=this.currentQuestion++;
          this.counter = 60;
          //this.points -= 10;
          if(qno >= this.questionList.length-1){
            this.isQuizCompleted = true;
            this.stopCounter();
          }

        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";

  }
  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }

download(){
   this.questionService.downloadCSV(this.retUsrstr)
      .subscribe((buffer) => {
         var data=this.b64toBlob(buffer);
         this.pdfURL = window.URL.createObjectURL(data);
         this.isShow = true;
        
      });
}

featureHide() {
 this.isShow= false;

};

b64toBlob(b64Data: string) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: "application/pdf" });
  return blob;
 
}
}
