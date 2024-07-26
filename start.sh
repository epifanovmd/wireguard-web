#!/bin/bash

docker build -f Dockerfile -t wireguard-web:latest .
[[ $(docker ps -f name=wireguard-web_container -q -a) != '' ]] && docker rm --force $(docker ps -f name=wireguard-web_container -q -a)
docker run -u root -d --restart=always --network server-net -p 8080:4173 --name wireguard-web_container wireguard-web:latest
docker image prune -a --force
