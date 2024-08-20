-- complain if script is sourced in psql, rather than via ALTER EXTENSION
\echo Use "ALTER EXTENSION postgres_fdw UPDATE TO '1.3'" to load this file. \quit

CREATE FUNCTION peerdb_exec (text, text)
RETURNS setof record
AS 'MODULE_PATHNAME','peerdb_exec'
LANGUAGE C STRICT PARALLEL RESTRICTED;
