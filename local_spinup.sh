docker build -t local-frontend -f dev.Dockerfile . 
docker run -it -p 3000:3000 -v $PWD/src:/app/src local-frontend