CREATE DATABASE IF NOT EXISTS football_db
    CHARACTER SET utf8mb4;

USE football_db;

CREATE TABLE team (
    team_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    team_name VARCHAR(50)  NOT NULL,
    PRIMARY KEY (team_id),
    UNIQUE KEY uq_team_name (team_name)
) ENGINE = InnoDB;

CREATE TABLE season (
    season_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    season_name VARCHAR(10)  NOT NULL,
    PRIMARY KEY (season_id),
    UNIQUE KEY uq_season_name (season_name)
) ENGINE = InnoDB;

CREATE TABLE football_match (
    match_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_date DATE         NOT NULL,
    season_id  INT UNSIGNED NOT NULL,
    PRIMARY KEY (match_id),
    KEY idx_football_match_date (match_date),
    CONSTRAINT fk_football_match_season
        FOREIGN KEY (season_id) REFERENCES season (season_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE participation (
    match_id        INT UNSIGNED        NOT NULL,
    team_id         INT UNSIGNED        NOT NULL,
    side            ENUM('HOME', 'AWAY') NOT NULL,
    goals           TINYINT UNSIGNED    NOT NULL,
    possession_pct  DECIMAL(4, 1)       NOT NULL,
    shots_on_target TINYINT UNSIGNED    NOT NULL,
    red_cards       TINYINT UNSIGNED    NOT NULL,
    PRIMARY KEY (match_id, team_id),
    UNIQUE KEY uq_participation_match_side (match_id, side),
    CONSTRAINT fk_participation_match
        FOREIGN KEY (match_id) REFERENCES football_match (match_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_participation_team
        FOREIGN KEY (team_id) REFERENCES team (team_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT ck_participation_possession
        CHECK (possession_pct BETWEEN 0 AND 100)
) ENGINE = InnoDB;