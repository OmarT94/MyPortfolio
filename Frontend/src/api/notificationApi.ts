import api from './axiosInstance'
import type { Notification, UnreadCountResponse } from '../types'

export const notificationApi = {
  getAll: () =>
    api.get<Notification[]>('/admin/notifications').then(r => r.data),

  getUnreadCount: () =>
    api.get<UnreadCountResponse>('/admin/notifications/unread/count').then(r => r.data),

  markAsRead: (id: string) =>
    api.patch(`/admin/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch('/admin/notifications/read-all'),
}
