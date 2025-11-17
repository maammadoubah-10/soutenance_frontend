import { NotificationDto, NotificationModel } from './notification.dto';

export function mapDto(n: NotificationDto): NotificationModel {
  return {
    id: n.id,
    type: n.type,
    title: n.title ?? n.type ?? 'Notification',
    message: n.message,
    readFlag: n.estLue,
    createdAt: n.dateEnvoi,
  };
}
