export interface NotificationDto {
  id: number;
  personnelId: number;
  type: string;
  title?: string | null;
  message: string;
  estLue: boolean;
  dateEnvoi: string; // ISO
}

export interface NotificationModel {
  id: number;
  type: string;
  title: string;
  message: string;
  readFlag: boolean;
  createdAt: string;
  link?: string;
}

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
