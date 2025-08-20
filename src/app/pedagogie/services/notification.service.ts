import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public contextPath: string = environment.hostmicroservicepedagogie + "notifications";


  constructor(private httpClient: HttpClient) { }

  public listeNotification(personnelId:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/unread/'+personnelId
    )}

  public nbreNotificationUnreadByType(preinscriptionId:number,type:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/unread/count/type/'+preinscriptionId +"/"+type
    )
  }

  public changeToReadByType(preinscriptionId:number,type:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/unread/change/'+preinscriptionId +"/"+type
    )
  }

  public listeNotificationUnread(preinscriptionId:number,){
    return this.httpClient.get<any>(
      this.contextPath+ '/count/'+preinscriptionId +"/unread"
    )
  }

}
