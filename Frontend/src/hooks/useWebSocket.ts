import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import toast from 'react-hot-toast'
import {useCompanyStore, useNotificationStore, useVisitStore} from '../store'
import { useAuthStore } from '../store'
import type { Notification } from '../types'

export const useWebSocket = () => {
  const clientRef = useRef<Client | null>(null)
  const role = useAuthStore((state) => state.role)
  const { addNotification } = useNotificationStore()


  useEffect(() => {

    // WebSocket فقط للـ Admin

    if (role !== 'ADMIN') return

    const client = new Client({
      webSocketFactory: () => {
        return new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`)
      },

      onConnect: () => {

        // الاشتراك في قناة الإشعارات
        client.subscribe('/topic/notifications', (message) => {
          const notification: Notification = JSON.parse(message.body)
          addNotification(notification)


          useCompanyStore.getState().fetchAll()
          useVisitStore.getState().fetchAll()
          useVisitStore.getState().fetchStats()
          useNotificationStore.getState().fetchUnreadCount()

          toast(notification.message, {
            icon: '🔔',
            duration: 5000,
          })
        })
      },

      onDisconnect: () => console.log('🔌 WebSocket disconnected'),
      onStompError: (frame) => console.error('WebSocket error:', frame),

      reconnectDelay: 5000, // إعادة الاتصال تلقائياً بعد 5 ثواني
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [role, addNotification])
}
