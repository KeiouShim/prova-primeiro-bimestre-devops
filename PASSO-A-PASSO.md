# Passo a passo para publicar e validar

## 1. Git (mínimo 6 commits + feature branch + merge)
```bash
cd prova-primeiro-bimestre-devops
git init -b main
git add .gitignore README.md .env.example
git commit -m "chore: inicializa repositorio com gitignore, README e env example"

git checkout -b feat/api-reservas
git add app/package.json app/src
git commit -m "feat: implementa API de reservas com CRUD e PostgreSQL"
git add app/Dockerfile app/.dockerignore
git commit -m "feat: adiciona Dockerfile multi-stage com usuario nao-root"
git add docker-compose.yml
git commit -m "feat: adiciona docker compose com API, PostgreSQL, volume e healthcheck"
git checkout main
git merge --no-ff feat/api-reservas -m "chore: merge feat/api-reservas"

git checkout -b feat/infra-terraform
git add infra/backend
git commit -m "feat: adiciona backend remoto S3 e DynamoDB"
git add infra
git commit -m "feat: adiciona infraestrutura modularizada VPC, SG, EC2 e RDS"
git checkout main && git merge --no-ff feat/infra-terraform -m "chore: merge feat/infra-terraform"

git add relatorio.md evidencias
git commit -m "docs: adiciona relatorio e evidencias"
git remote add origin https://github.com/SEU-USUARIO/prova-primeiro-bimestre-devops.git
git push -u origin main --all
```

## 2. Local
```bash
cp .env.example .env   # edite a senha
docker build -t reservas-api ./app 2>&1 | tee evidencias/docker-build.txt
docker compose up -d --build
docker compose ps | tee evidencias/compose-ps.txt
```

## 3. AWS (Learner Lab: exporte AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
```bash
cd infra/backend && terraform init && terraform apply -var="bucket_name=technova-tfstate-SEU-RA"
cd .. # edite bucket em providers.tf
export TF_VAR_db_password=SenhaForte123
terraform init && terraform fmt -recursive && terraform validate
terraform plan -var="repo_url=https://github.com/SEU-USUARIO/prova-primeiro-bimestre-devops.git" | tee ../evidencias/terraform-plan.txt
terraform apply -var="repo_url=..."
curl $(terraform output -raw api_url)/health
terraform destroy -var="repo_url=..."
```
(Destrua também infra/backend se quiser zerar tudo; esvazie o bucket versionado antes.)

## 4. Entrega
Fork do repo da disciplina -> entregas/provaPrimeiroBi/SEU-RA/entrega.md -> Pull Request.
