provider "aws" {
    region = "eu-central-1"
  
}

#create vpc 
resource "aws_vpc" "todo-vpc" {
    cidr_block = "10.0.0.0/16"
  
}
