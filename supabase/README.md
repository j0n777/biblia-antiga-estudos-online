# Backend do Bíblia de Estudos Original (Supabase)

- `migrations/20250101000000_base_schema.sql` — schema completo (24 tabelas, 4 funções), reconstruído da VPS.
- `migrations/2025061*.sql`, `2025062*.sql` — migrações originais da Lovable (word mappings / cache), idempotentes.
- `migrations/20260917120000_rls_policies.sql` — RLS: catálogo público, dados de usuário só do dono, comunidade legível.
- `functions/` — 6 Edge Functions. Secrets: `OPENAI_API_KEY` (e opcionais `OPENAI_BASE_URL`, `OPENAI_MODEL` para OpenRouter).
- **Seeds** (versões, livros, capítulos, 186 mil versículos, Strong's, estudos, conquistas, prompts) não estão no git
  (46 MB). Vivem em `/home/docker-sites/biblia-original/init-db/` na VPS e são carregados com
  `migrate-to-supabase.sh` (psql direto no projeto). Ordem: 02 → 09, depois `10_fix_book_positions.sql`.
