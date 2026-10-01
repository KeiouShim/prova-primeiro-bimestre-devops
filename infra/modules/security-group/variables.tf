variable "name" { type = string }
variable "vpc_id" { type = string }
variable "ssh_cidr" {
  type    = string
  default = "0.0.0.0/0"
}
variable "tags" {
  type    = map(string)
  default = {}
}
