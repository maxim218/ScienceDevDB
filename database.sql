DROP TABLE IF EXISTS people;

CREATE TABLE people
(
    man_id BIGSERIAL PRIMARY KEY,
    man_nickname TEXT COLLATE "ucs_basic",
    man_password TEXT COLLATE "ucs_basic"
);

/* -------------------------------------------------------- */

DROP TABLE IF EXISTS records;

CREATE TABLE records
(
    record_id BIGSERIAL PRIMARY KEY,
    record_content TEXT COLLATE "ucs_basic",
    man_key BIGINT
);

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_records_of_user(login_param TEXT)
   RETURNS TABLE
   (
       record_id_t BIGINT,
       record_content_t TEXT,
       man_id_t BIGINT,
       man_nickname_t TEXT
   )
   AS $mytable$
BEGIN
   RETURN QUERY
   SELECT record_id AS record_id_t, record_content AS record_content_t, man_id AS man_id_t, man_nickname AS man_nickname_t FROM records INNER JOIN people ON (man_key = man_id) WHERE man_nickname = login_param ORDER BY record_id DESC;
END
$mytable$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION add_record(login_param TEXT, password_param TEXT, content_param TEXT) RETURNS TEXT AS $$
    DECLARE man RECORD;
    DECLARE n BIGINT;
    DECLARE found BOOLEAN;
BEGIN
    found = False;
    n = 0;
    FOR man IN SELECT man_id FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        found = True;
        n = man.man_id;
    END LOOP;
    IF (found = False) THEN
        RETURN '__USER_NOT_FOUND__';
    END IF;
    INSERT INTO records (record_content, man_key) VALUES (content_param, n);
    RETURN '__ADD_RECORD_OK__';
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION add_user(login_param TEXT, password_param TEXT) RETURNS TEXT AS $$
    DECLARE man RECORD;
    DECLARE add BOOLEAN;
BEGIN
    add = True;
    FOR man IN SELECT man_nickname FROM people WHERE man_nickname = login_param LIMIT 1 LOOP
      add = False;
    END LOOP;
    IF (add = True) THEN
        INSERT INTO people (man_nickname, man_password) VALUES (login_param, password_param);
        RETURN '__YES__';
    END IF;
    RETURN '__NO__';
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION normal_login_password(login_param TEXT, password_param TEXT) RETURNS TEXT AS $$
    DECLARE man RECORD;
    DECLARE man_result RECORD;
    DECLARE found BOOLEAN;
BEGIN
    found = False;
    FOR man IN SELECT man_nickname, man_password FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        man_result = man;
        found = True;
    END LOOP;
    IF (found = False) THEN
        RETURN '{}';
    END IF;
    RETURN to_json(man_result);
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */
