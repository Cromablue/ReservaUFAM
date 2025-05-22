-- Ativar extensão
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Criação do replicator
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_roles WHERE rolname = 'replicator'
   ) THEN
      CREATE ROLE replicator WITH LOGIN REPLICATION PASSWORD 'replicator_password';
   END IF;
END
$$;

-- Permissões
GRANT CONNECT ON DATABASE reserve_database TO replicator;
GRANT USAGE ON SCHEMA public TO replicator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO replicator;

-- Criar o node lógico (servidor primário)
SELECT pglogical.create_node(
    node_name := 'servidor1_node',
    dsn := 'host=reservaufam_db port=5432 dbname=reserve_database user=replicator password=replicator_password'
);

-- Cria a replication set
SELECT pglogical.create_replication_set('default', true, true, false, true);

-- Adiciona tabelas específicas
SELECT pglogical.replication_set_add_table('default', 'reserve_reservation', true);
SELECT pglogical.replication_set_add_table('default', 'reserve_customuser', true);
