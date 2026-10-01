# API de Reservas — TechNova

**Aluno:** Caio Akiyama Shimabuku
**RA:** 6325124

API REST em Node.js/Express (CRUD de reservas) persistindo em PostgreSQL, containerizada com Docker, orquestrada localmente com Docker Compose e provisionada na AWS (Learner Lab) com Terraform modularizado e estado remoto (S3 + DynamoDB).

## Rotas
| Método | Rota | Descrição |
|---|---|---|
| POST | /reservas | Cria reserva (`cliente`, `data` obrigatórios; `status` opcional) |
| GET | /reservas | Lista reservas |
| GET | /reservas/:id | Busca por id (404 se não existir) |
| PUT | /reservas/:id | Atualiza reserva |
| DELETE | /reservas/:id | Remove reserva |
| GET | /health | Verificação de integridade |

## Ambiente local
```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
curl -X POST localhost:3000/reservas -H 'Content-Type: application/json' \
  -d '{"cliente":"Ana","data":"2026-10-15","status":"pendente"}'
curl localhost:3000/reservas
```

## Infraestrutura AWS (us-east-1, Learner Lab)
```bash
# 1) estado remoto (uma vez)
cd infra/backend && terraform init && terraform apply -var="bucket_name=technova-tfstate-SEU-RA"
# 2) ajuste o bucket em infra/providers.tf, depois:
cd .. && terraform init
export TF_VAR_db_password='senha-forte'
terraform plan -var="repo_url=https://github.com/KeiouShim/prova-primeiro-bimestre-devops.git"
terraform apply -var="repo_url=..."
# ao final, SEMPRE:
terraform destroy
```
Usa `LabInstanceProfile` (nenhum recurso IAM é criado).
