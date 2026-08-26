export enum NotificationType {
  KYC_APPROVED = 'KYC_APPROVED',
  KYC_REJECTED = 'KYC_REJECTED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum NotificationStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class Notification {
  readonly id!: string;
  userId!: string;
  type!: NotificationType;
  message!: string;
  channel!: NotificationChannel;
  status!: NotificationStatus;
  createdAt!: Date;

  constructor(partial: Partial<Notification>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
}