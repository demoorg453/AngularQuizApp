import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class QuestionService {
//baseurl:string="https://mcqapp-hemughk-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com/";
baseurl:string="https://known-ant-loving.ngrok-free.app/mcq/";
 constructor(private http : HttpClient) { }

getQuestionJson(_data: any): Observable<any> {
   const url=this.baseurl+"api/questions";
  return this.http.get(url, {
    headers: {'ngrok-skip-browser-warning': 'true'},
    params: {
      'studCode': _data,
    },
    responseType: "json"
  });
 }
  
  sendPostRequest(_data: any): Observable<any> {
   /* const headers = { 'content-type': 'application/json',
    'ngrok-skip-browser-warning': 'true'} ;
    const body=JSON.stringify(_data);
    return this.http.post<any>(this.baseurl+"/api/answers",
    body,{'headers':headers});*/
    const body=JSON.stringify(_data); 
    const url=this.baseurl+"api/answers";
    return this.http.post<any>(url,body, {
      headers: {'ngrok-skip-browser-warning': 'true'},
      params: {
        'studCode': _data,
      },
      responseType: "json"
    });


}

downloadCSV(_data: any): Observable<any> {
  const userstr=JSON.stringify(_data);
  return this.http.get(this.baseurl+"api/download", {
    headers: {'ngrok-skip-browser-warning': 'true'},
    params: {
      'userstr':userstr
    },
    responseType: "text"
  });
 }

}
