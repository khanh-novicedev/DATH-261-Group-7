package com.class2life.repository.live;

import com.class2life.entity.live.LiveSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface LiveSessionRepository extends JpaRepository<LiveSession, UUID> {

}
