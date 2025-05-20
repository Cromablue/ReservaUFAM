-- Cria extensão pglogical
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Cria usuário replicador
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'replicator'
   ) THEN
      CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_password';
   END IF;
END
$$;
