-- Ativa a extensão
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Criação do replicator (apenas uma vez)
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

-- Para o servidor 2
SELECT pglogical.create_node(
    node_name := 'servidor2_node',
    dsn := 'host=192.168.1.216 port=5432 dbname=reserve_database user=replicator password=replicator_password'
);

-- Criação do replication set
SELECT pglogical.create_replication_set(
    set_name := 'default', 
    replicate_insert := true, 
    replicate_update := true, 
    replicate_delete := true, 
    replicate_truncate := true
);

-- Adiciona as tabelas ao replication set
SELECT pglogical.replication_set_add_table('default', 'reserve_reservation', true);
SELECT pglogical.replication_set_add_table('default', 'reserve_customuser', true);
