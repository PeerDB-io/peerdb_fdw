`peerdb_fdw` is a copy of postgres_fdw with a couple adjustments to improve usability with PeerDB's query layer.

First, some cost adjustments were made to encourage pushing down everything. Second, a UDF `peerdb_exec` using code from dblink was put together so that users can explicitly craft queries if postgres planner isn't playing along or they have specific syntax for PeerDB
