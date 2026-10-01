variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "technova-reservas"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "45.236.250.149" {
  description = "CIDR autorizado no SSH (22). Restrinja ao seu IP (x.x.x.x/32)."
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_name" {
  description = "Key pair existente (opcional). Null = sem SSH por chave."
  type        = string
  default     = null
}

variable "db_name" {
  type    = string
  default = "reservas"
}

variable "db_username" {
  type    = string
  default = "reservas_user"
}

variable "db_password" {
  description = "Informe via TF_VAR_db_password (não versionar)"
  type        = string
  sensitive   = true
}

variable "repo_url" {
  description = "URL pública do repositório com a pasta app/ (clonada pela EC2)"
  type        = string
}
