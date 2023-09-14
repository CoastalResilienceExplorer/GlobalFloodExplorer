## Services
This directory holds services relevant to working with the GlobalFloodExplorer.  To add new services, modify either `cloudbuild.yaml` or `deploy_all.sh`.

Currently, there isn't much need to have both `cloudbuild.yaml` and `deploy_all.sh`, since the YAML is simple.  However it's nice to keep it anyway, since it's often a little easier to manage deployments with bash commands instead of pure YAML.  

The gist of this root build should just kick off builds of the other services, not build anything of its own.