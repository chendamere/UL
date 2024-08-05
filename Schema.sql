CREATE DATABASE UL_rule;
USE UL_rule;

CREATE TABLE rules(
    id integer PRIMARY KEY AUTO_INCREMENT,
    contents TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO rules (contents)
VALUES
(',#1 0, @ , #1 0,');

ALTER TABLE rules AUTO_INCREMENT = 1