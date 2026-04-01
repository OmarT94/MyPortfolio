package com.myportfolio.backend.notification;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends MongoRepository<Notification, String> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
}