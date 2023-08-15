resource "google_cloudbuild_trigger" "filename-trigger" {
  location = "us-west1"

  trigger_template {
    branch_name = "staging"
    repo_name   = "GlobalFloodExplorer"
  }

  filename = "services/cloudbuild.yaml"
}