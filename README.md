# Developer Environment
`docker build -t dev -f ./dev.Dockerfile .`
`docker run -p 3000:3000 -v $PWD:/app/ -it -e REACT_APP_USE_SITE_GATING=true dev`
