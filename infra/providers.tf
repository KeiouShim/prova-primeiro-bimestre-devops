terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }

  # Backend não aceita variáveis: ajuste o nome do bucket criado em infra/backend
  backend "s3" {
    bucket         = "technova-tfstate-6325124"
    key            = "reservas/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "technova-tf-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.tags
  }
}
