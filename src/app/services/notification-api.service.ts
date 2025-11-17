import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { NotificationDto } from '../models/notification.dto';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private baseUrl = (env.hostmicroservicepersonnel.replace(/\/?$/, '/')) + 'notifications';

  constructor(private http: HttpClient) {}

  list(personnelId: number, page = 0, size = 10): Observable<Page<NotificationDto>> {
    const params = new HttpParams()
      .set('personnelId', personnelId)
      .set('page', page)
      .set('size', size);
    return this.http.get<Page<NotificationDto>>(this.baseUrl, { params });
  }

  unreadCount(personnelId: number): Observable<number> {
    const params = new HttpParams().set('personnelId', personnelId);
    return this.http.get<number>(`${this.baseUrl}/unread-count`, { params });
  }

  markRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/read`, {});
  }
}
