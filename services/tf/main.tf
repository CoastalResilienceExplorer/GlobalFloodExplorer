terraform {
  backend "gcs" {
    bucket  = "global-mangroves-tfstate"
    prefix  = "services"
  }
}

provider "google" {
  project     = "global-mangroves"
  region      = "us-west1"
}

resource "google_cloudbuild_trigger" "filename-trigger" {
  name = "services-trigger"
  
  trigger_template {
    branch_name = "staging"
    repo_name   = "CoastalResilienceExplorer/GlobalFloodExplorer"
  }

  filename = "services/cloudbuild.yaml"
}