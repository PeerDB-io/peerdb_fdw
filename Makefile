# contrib/postgres_fdw/Makefile

MODULE_big = postgres_fdw
OBJS = \
	$(WIN32RES) \
	connection.o \
	deparse.o \
	option.o \
	postgres_fdw.o \
	shippable.o
PGFILEDESC = "postgres_fdw - foreign data wrapper for PostgreSQL"

PG_CPPFLAGS = -I$(libpq_srcdir)
SHLIB_LINK_INTERNAL = $(libpq)

EXTENSION = postgres_fdw
DATA = postgres_fdw--1.0.sql postgres_fdw--1.0--1.1.sql postgres_fdw--1.1--1.3.sql

REGRESS = postgres_fdw

# always use PGXS
PG_CONFIG = pg_config
PGXS := $(shell $(PG_CONFIG) --pgxs)
include $(PGXS)
