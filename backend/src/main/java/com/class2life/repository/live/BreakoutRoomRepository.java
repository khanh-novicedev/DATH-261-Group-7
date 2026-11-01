package com.class2life.repository.live;

import com.class2life.entity.live.BreakoutRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BreakoutRoomRepository extends JpaRepository<BreakoutRoom, UUID> {
    Optional<BreakoutRoom> findFirstBySessionIdOrderByCreatedAtAsc(UUID sessionId);
}
