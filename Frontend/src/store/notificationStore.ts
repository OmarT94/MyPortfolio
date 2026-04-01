import { create } from 'zustand'
import type { Notification } from '../types'
import { notificationApi } from '../api'

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean

  // Actions
  setNotifications: (list: Notification[]) => void
  addNotification: (n: Notification) => void
  setUnreadCount: (count: number) => void
  togglePanel: () => void
  closePanel: () => void
  markAllRead: () => Promise<void>
  fetchAll: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
}

export const useNotificationStore
    = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,

  // ─── Setters ────────────────────────────────────────────────────────────────
  setNotifications: (list) => set({ notifications: list }),

  // ─── إضافة إشعار جديد من WebSocket ─────────────────────────────────────────
  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),

  // ─── تعليم الكل كمقروء ──────────────────────────────────────────────────────
  markAllRead: async () => {
    await notificationApi.markAllAsRead()
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  // ─── جلب من Backend ─────────────────────────────────────────────────────────
  fetchAll: async () => {
    const list = await notificationApi.getAll()
    set({ notifications: list })
  },

  fetchUnreadCount: async () => {
    const res = await notificationApi.getUnreadCount()
    set({ unreadCount: res.count })
  },
}))
