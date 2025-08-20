import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public contextPath: string = environment.hostmicroservicepersonnel + "notifications";


  constructor(private httpClient: HttpClient) { }

  public listeNotification(personnelId:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/unread/'+personnelId
    )}

  public listeNotificationUnread(personnelId:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/unread/count/'+personnelId
    )}
}
