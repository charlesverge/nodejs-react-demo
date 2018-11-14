--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.14
-- Dumped by pg_dump version 9.5.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: accesstokens; Type: TABLE; Schema: public; Owner: charles
--

CREATE TABLE public.accesstokens (
    token character varying(100)
);


ALTER TABLE public.accesstokens OWNER TO charles;

--
-- Name: events; Type: TABLE; Schema: public; Owner: charles
--

CREATE TABLE public.events (
    name character varying(100),
    "time" integer
);


ALTER TABLE public.events OWNER TO charles;

--
-- Data for Name: accesstokens; Type: TABLE DATA; Schema: public; Owner: charles
--

COPY public.accesstokens (token) FROM stdin;
test1
test2
test3
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: charles
--

COPY public.events (name, "time") FROM stdin;
companies	2689
companies	2732
companies	2736
companies	0
companies	0
companies	0
companies	0
companies	0
companies	668
companies	568
companies	516
companies	2118
companies	2052
companies	1912
companies	1959
companies	2192
companies	2142
companies	2101
\.


--
-- PostgreSQL database dump complete
--

