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

CREATE OR REPLACE FUNCTION get_users_list() RETURNS TEXT AS $$
    DECLARE n BIGINT;
    DECLARE arr TEXT ARRAY;
    DECLARE man RECORD;
BEGIN
    n = 0;

    FOR man IN SELECT man_nickname FROM people ORDER BY man_nickname ASC LOOP
        n = n + 1;
        arr[n] = man.man_nickname;
    END LOOP;

    IF (n = 0) THEN
        RETURN '[]';
    END IF;

    RETURN array_to_json(arr);
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION delete_one_record_of_user(login_param TEXT, password_param TEXT, record_id_param_string TEXT) RETURNS TEXT AS $$
    DECLARE record_id_param BIGINT;
    DECLARE man RECORD;
    DECLARE zap RECORD;
    DECLARE mixed RECORD;
    DECLARE man_found BOOLEAN;
    DECLARE zap_found BOOLEAN;
    DECLARE it_is_his_zap BOOLEAN;
BEGIN
    man_found = False;
    zap_found = False;
    it_is_his_zap = False;

    record_id_param = CAST(record_id_param_string AS BIGINT);

    FOR man IN SELECT man_id FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        man_found = True;
    END LOOP;
    IF (man_found = False) THEN
        RETURN '__MAN_NOT_FOUND__';
    END IF;

    FOR zap IN SELECT record_id FROM records WHERE record_id = record_id_param LIMIT 1 LOOP
        zap_found = True;
    END LOOP;
    IF (zap_found = False) THEN
        RETURN '__RECORD_NOT_EXISTS__';
    END IF;

    FOR mixed IN SELECT record_id, man_key, man_id, man_nickname FROM records INNER JOIN people ON (man_key = man_id) WHERE record_id = record_id_param AND man_nickname = login_param LIMIT 1 LOOP
        it_is_his_zap = True;
    END LOOP;
    IF (it_is_his_zap = False) THEN
        RETURN '__YOU_HAVE_NOT_RIGHTS_TO_DELETE_RECORD__';
    END IF;

    DELETE FROM records WHERE record_id = record_id_param;
    RETURN '__DELETE_OK__';
END;
$$ LANGUAGE plpgsql;

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
