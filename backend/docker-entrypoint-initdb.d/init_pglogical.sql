-- Cria a extensão pglogical (se ainda não existir)
CREATE EXTENSION IF NOT EXISTS pglogical;

-- Cria o usuário replicador se não existir
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_roles WHERE rolname = 'replicator'
   ) THEN
      CREATE ROLE replicator WITH LOGIN REPLICATION PASSWORD 'replicator_password';
   END IF;
END
$$;

-- Concede permissões ao usuário replicator (ajuste o nome do banco após a criação do banco)
-- OBS: este script será executado no contexto do banco definido como POSTGRES_DB
-- Portanto não é necessário mudar de banco aqui

GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO replicator;
GRANT USAGE ON SCHEMA public TO replicator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator;

-- Permite acesso a futuras tabelas automaticamente
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO replicator;

-- Cria o node lógico
SELECT pglogical.create_node(
    node_name := 'servidor1_node',
    dsn := 'host=reservaufam_db port=5432 dbname=your_database user=replicator password=replicator_password'
);

-- Cria a replication set com tabelas específicas (exemplo)
SELECT pglogical.create_replication_set('default', true, true, false, true);

-- Adiciona tabelas à replication set
SELECT pglogical.replication_set_add_table('default', 'reserve_reservation', true);
SELECT pglogical.replication_set_add_table('default', 'reserve_customuser', true);
