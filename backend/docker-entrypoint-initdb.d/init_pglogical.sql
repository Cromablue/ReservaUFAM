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
