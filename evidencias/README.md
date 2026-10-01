Gere e salve aqui (saidas reais do SEU ambiente):
- docker-build.txt   -> docker build -t reservas-api ./app 2>&1 | tee evidencias/docker-build.txt
- compose-ps.txt     -> docker compose ps | tee evidencias/compose-ps.txt
- terraform-plan.txt -> (em infra/) terraform plan | tee ../evidencias/terraform-plan.txt
- testes de curl (CRUD local e na nuvem) e print do terraform destroy
