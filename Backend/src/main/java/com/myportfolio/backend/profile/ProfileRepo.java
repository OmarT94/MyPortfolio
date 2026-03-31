package com.myportfolio.backend.profile;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepo extends MongoRepository<Profile, String> {
    // يوجد سجل واحد فقط للبروفايل — findAll().get(0)
}