import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subject, takeUntil } from 'rxjs';
import { NotificationApiService } from '../../services/notification-api.service';
import { CurrentUserStore } from '../../store/current-user.store';
import { Page } from '../../models/page.model';
import { NotificationDto } from '../../models/notification.dto';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unread = 0;
  loading = false;

  items: NotificationDto[] = [];
  page = 0;
  size = 10;
  hasMore = false;

  private destroy$ = new Subject<void>();
  private personnelId?: number;

  constructor(
    private api: NotificationApiService,
    private userStore: CurrentUserStore
  ) {}

  ngOnInit(): void {
    const user = this.userStore.value;
    if (!user) return;
    this.personnelId = user.personnelId;

    this.refreshCount();
    interval(30000).pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshCount());
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  refreshCount(): void {
    if (!this.personnelId) return;
    this.api.unreadCount(this.personnelId).subscribe({
      next: (c: number) => (this.unread = c),
      error: () => {}
    });
  }

  openDropdown(): void {
    if (!this.personnelId) return;
    this.loading = true;
    this.api.list(this.personnelId, 0, this.size).subscribe({
      next: (p: Page<NotificationDto>) => {
        this.items = p.content || [];
        this.page = p.number;
        this.hasMore = p.number < p.totalPages - 1;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  loadMore(ev: Event): void {
    ev.stopPropagation();
    if (!this.personnelId) return;
    this.loading = true;
    this.api.list(this.personnelId, this.page + 1, this.size).subscribe({
      next: (p: Page<NotificationDto>) => {
        this.items = [...this.items, ...(p.content || [])];
        this.page = p.number;
        this.hasMore = p.number < p.totalPages - 1;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onItemClick(n: NotificationDto): void {
    this.api.markRead(n.id).subscribe({
      next: () => this.refreshCount(),
      error: () => {}
    });
  }
}
