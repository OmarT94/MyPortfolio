package com.myportfolio.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // الـ Admin يستقبل الإشعارات من هذا الـ prefix
        registry.enableSimpleBroker("/topic");
        // الـ Frontend يرسل للـ Backend من هذا الـ prefix
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // نقطة الاتصال بالـ WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3011")
                .withSockJS(); // دعم المتصفحات القديمة
    }
}