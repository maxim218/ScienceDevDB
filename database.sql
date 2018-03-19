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

DROP TABLE IF EXISTS movies;

CREATE TABLE movies
(
    movie_id BIGSERIAL PRIMARY KEY,
    movie_name TEXT COLLATE "ucs_basic",
    movie_user_id BIGINT,
    movie_content TEXT COLLATE "ucs_basic"
);

/* -------------------------------------------------------- */

DROP TABLE IF EXISTS threeprojects;

CREATE TABLE threeprojects
(
    threeproject_id BIGSERIAL PRIMARY KEY,
    threeproject_name TEXT COLLATE "ucs_basic",
    threeproject_user_nickname TEXT COLLATE "ucs_basic",
    threeproject_content TEXT COLLATE "ucs_basic"
);

/* -------------------------------------------------------- */

DROP TABLE IF EXISTS forums;

CREATE TABLE forums
(
    forum_id BIGSERIAL PRIMARY KEY,
    forum_user TEXT COLLATE "ucs_basic",
    forum_content TEXT COLLATE "ucs_basic"
);

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_all_forums ()
    RETURNS TABLE
    (
        forum_id BIGINT,
        forum_user TEXT,
        forum_content TEXT
    )
    AS $mytable$
BEGIN
    RETURN QUERY
    SELECT * FROM forums ORDER BY forum_id DESC;
END
$mytable$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION add_forum (login_param TEXT, password_param TEXT, content_param TEXT) RETURNS TEXT AS $$
    DECLARE user_exists BOOLEAN;
    DECLARE man RECORD;
BEGIN
    user_exists = False;
    FOR man IN SELECT man_nickname, man_password FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        user_exists = True;
    END LOOP;
    IF (user_exists = False) THEN
        RETURN '__NO_USER__';
    END IF;
    INSERT INTO forums (forum_user, forum_content) VALUES (login_param, content_param);
    RETURN '__INSERT_FORUM_OK__';
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_one_three_project_of_user (threeproject_name_param TEXT, threeproject_user_nickname_param TEXT) RETURNS TEXT AS $$
    DECLARE s TEXT;
    DECLARE r RECORD;
BEGIN
    s = '__PROJECT_3D_NOT_FOUND__';
    FOR r IN SELECT * FROM threeprojects WHERE threeproject_name = threeproject_name_param AND threeproject_user_nickname = threeproject_user_nickname_param LIMIT 1 LOOP
        s = r.threeproject_content;
    END LOOP;
    RETURN s;
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_three_projects (login_param TEXT) RETURNS TEXT AS $$
    DECLARE k BIGINT;
    DECLARE r RECORD;
    DECLARE mass TEXT ARRAY;
BEGIN
    k = 0;
    FOR r IN SELECT threeproject_id, threeproject_name FROM threeprojects WHERE threeproject_user_nickname = login_param ORDER BY threeproject_id DESC LOOP
        k = k + 1;
        mass[k] = r.threeproject_name;
    END LOOP;
    IF (k = 0) THEN
        RETURN '[]';
    END IF;
    RETURN array_to_json(mass);
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION save_update_three_project (login_param TEXT, password_param TEXT, project_name TEXT, project_content TEXT) RETURNS TEXT AS $$
    DECLARE man_exist BOOLEAN;
    DECLARE man RECORD;
    /*******/
    DECLARE project_exists BOOLEAN;
    DECLARE project RECORD;
BEGIN
    man_exist = False;
    FOR man IN SELECT man_nickname FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        man_exist = True;
    END LOOP;
    IF (man_exist = False) THEN
        RETURN '__NO_USER__';
    END IF;
    /*******/
    project_exists = False;
    FOR project IN SELECT threeproject_name, threeproject_user_nickname FROM threeprojects WHERE threeproject_user_nickname = login_param AND threeproject_name = project_name LIMIT 1 LOOP
        project_exists = True;
    END LOOP;
    IF (project_exists = True) THEN
        UPDATE threeprojects SET threeproject_content = project_content WHERE threeproject_user_nickname = login_param AND threeproject_name = project_name;
        RETURN '__UPDATE_PROJECT_OK__';
    END IF;
    INSERT INTO threeprojects (threeproject_name, threeproject_user_nickname, threeproject_content) VALUES (project_name, login_param, project_content);
    RETURN '__INSERT_PROJECT_OK___';
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_one_rolic_by_login_and_name (login_param TEXT, movie_name_param TEXT) RETURNS TEXT AS $$
    DECLARE r RECORD;
    DECLARE ans TEXT;
BEGIN
    ans = '_NOT_FOUND_';
    FOR r IN SELECT movie_id, movie_name, movie_user_id, movie_content, man_id, man_nickname FROM movies INNER JOIN people ON movie_user_id = man_id WHERE man_nickname = login_param AND movie_name = movie_name_param LIMIT 1 LOOP
        ans = r.movie_content;
    END LOOP;
    RETURN ans;
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_rolix_list (login_param TEXT) RETURNS TEXT AS $$
    DECLARE r RECORD;
    DECLARE n BIGINT;
    DECLARE arr TEXT ARRAY;
BEGIN
    n = 0;
    FOR r IN SELECT movie_id, movie_name, movie_user_id, man_id, man_nickname FROM movies INNER JOIN people ON (man_id = movie_user_id) ORDER BY movie_id DESC LOOP
        IF (r.man_nickname = login_param) THEN
            n = n + 1;
            arr[n] = r.movie_name;
        END IF;
    END LOOP;
    IF (n = 0) THEN
        RETURN '[]';
    END IF;
    RETURN array_to_json(arr);
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION create_or_update_movie (login_param TEXT, password_param TEXT, movie_name_param TEXT, movie_content_param TEXT) RETURNS TEXT AS $$
    DECLARE user_exists BOOLEAN;
    DECLARE user_id BIGINT;
    DECLARE man RECORD;
    /* ----- */
    DECLARE movie_exists BOOLEAN;
    DECLARE movie RECORD;
BEGIN
    user_exists = False;
    user_id = 0;
    FOR man IN SELECT man_id, man_nickname, man_password FROM people WHERE man_nickname = login_param AND man_password = password_param LIMIT 1 LOOP
        user_exists = True;
        user_id = man.man_id;
    END LOOP;
    IF (user_exists = False) THEN
        RETURN '__USER_NOT_CORRECT__';
    END IF;
    /* ----- */
    movie_exists = False;
    FOR movie IN SELECT movie_name, movie_user_id FROM movies WHERE movie_name = movie_name_param AND movie_user_id = user_id LIMIT 1 LOOP
        movie_exists = True;
    END LOOP;
    IF (movie_exists = True) THEN
        UPDATE movies SET movie_content = movie_content_param WHERE movie_name = movie_name_param AND movie_user_id = user_id;
        RETURN '__UPDATE_OK__';
    END IF;
    /* ----- */
    INSERT INTO movies (movie_name, movie_user_id, movie_content) VALUES (movie_name_param, user_id, movie_content_param);
    RETURN '__CREATE_OK__';
END;
$$ LANGUAGE plpgsql;

/* -------------------------------------------------------- */

CREATE OR REPLACE FUNCTION get_users_list() RETURNS TEXT AS $$
    DECLARE n BIGINT;
    DECLARE arr TEXT ARRAY;
    DECLARE man RECORD;
BEGIN
    n = 0;

    FOR man IN SELECT man_nickname FROM people ORDER BY LOWER(man_nickname) ASC LOOP
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
