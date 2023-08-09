# Developer Environment
`docker build -t dev -f ./Dockerfile_dev .`
`docker run -p 3000:3000 -v $PWD:/app/ -it -e REACT_APP_USE_SITE_GATING=true dev`
