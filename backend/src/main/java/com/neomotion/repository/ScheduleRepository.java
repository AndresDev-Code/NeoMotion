package com.neomotion.repository;

import com.neomotion.entity.Schedule;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository
        extends JpaRepository<Schedule, Long> {

    // =================================================
    // CONSULTAS GENERALES
    // =================================================

    List<Schedule> findAllByOrderByAirDateAscStartTimeAsc();


    List<Schedule> findByAirDateOrderByStartTimeAsc(
            LocalDate airDate
    );


    List<Schedule> findByAirDateBetweenOrderByAirDateAscStartTimeAsc(
            LocalDate startDate,
            LocalDate endDate
    );


    Optional<Schedule> findTopByAirDateOrderByEndTimeDesc(
            LocalDate airDate
    );


    // =================================================
    // BUSCAR POR CONTENIDO
    // =================================================

    List<Schedule> findByEpisodeId(
            Long episodeId
    );


    List<Schedule> findByMediaContentId(
            Long mediaContentId
    );

    boolean existsByMediaContentId(
            Long mediaContentId
    );

    // =================================================
   // PROGRAMACIÓN GENERADA POR BLOQUE
   // =================================================

    List<Schedule>
    findByProgrammingBlockIdOrderByAirDateAscStartTimeAsc(
            Long programmingBlockId
    );

    @Query("""
    SELECT s
    FROM Schedule s
    WHERE s.programmingBlock.id = :programmingBlockId
      AND (
          s.airDate > :currentDate
          OR (
              s.airDate = :currentDate
              AND s.startTime > :currentTime
          )
      )
    ORDER BY s.airDate ASC, s.startTime ASC
    """)
    List<Schedule> findFutureSchedulesByProgrammingBlockId(
            @Param("programmingBlockId") Long programmingBlockId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime
    );


    // =================================================
    // PROGRAMACIÓN ACTUAL
    // =================================================

    @Query("""
        SELECT s
        FROM Schedule s
        WHERE s.airDate = :airDate
        AND s.startTime <= :currentTime
        AND s.endTime > :currentTime
        AND s.active = true
        """)
    Optional<Schedule> findCurrentSchedule(
            @Param("airDate")
            LocalDate airDate,

            @Param("currentTime")
            LocalTime currentTime
    );


    // =================================================
    // SIGUIENTE PROGRAMACIÓN
    // =================================================

    @Query("""
        SELECT s
        FROM Schedule s
        WHERE s.active = true
        AND (
            s.airDate > :airDate
            OR (
                s.airDate = :airDate
                AND s.startTime > :currentTime
            )
        )
        ORDER BY s.airDate ASC,
                 s.startTime ASC
        """)
    List<Schedule> findNextSchedule(
            @Param("airDate")
            LocalDate airDate,

            @Param("currentTime")
            LocalTime currentTime,

            Pageable pageable
    );


    // =================================================
    // CONFLICTOS AL CREAR
    // =================================================

    @Query("""
        SELECT s
        FROM Schedule s
        WHERE s.airDate = :airDate
        AND s.startTime < :endTime
        AND s.endTime > :startTime
        """)
    List<Schedule> findConflictingSchedules(
            @Param("airDate")
            LocalDate airDate,

            @Param("startTime")
            LocalTime startTime,

            @Param("endTime")
            LocalTime endTime
    );


    // =================================================
    // CONFLICTOS AL ACTUALIZAR
    // =================================================

    @Query("""
        SELECT s
        FROM Schedule s
        WHERE s.airDate = :airDate
        AND s.id <> :scheduleId
        AND s.startTime < :endTime
        AND s.endTime > :startTime
        """)
    List<Schedule> findConflictingSchedulesForUpdate(
            @Param("airDate")
            LocalDate airDate,

            @Param("startTime")
            LocalTime startTime,

            @Param("endTime")
            LocalTime endTime,

            @Param("scheduleId")
            Long scheduleId
    );
}