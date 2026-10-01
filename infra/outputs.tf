output "ec2_public_ip" {
  description = "IP público da EC2"
  value       = module.ec2.public_ip
}

output "rds_endpoint" {
  description = "Endpoint do RDS PostgreSQL"
  value       = module.rds.endpoint
}

output "api_url" {
  description = "URL da API na nuvem"
  value       = "http://${module.ec2.public_ip}:3000"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}
