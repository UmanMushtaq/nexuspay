
import { Notification } from '../entities/notification.entity';
export interface NotificationRepository{
    create(notification:Notification): Promise<Notification>
    findByUserId(userId:string): Promise<Notification[]>
}