#!/bin/bash

docker build -f Dockerfile -t wireguard-admin:latest .
[[ $(docker ps -f name=wireguard-admin_container -q -a) != '' ]] && docker rm --force $(docker ps -f name=wireguard-admin_container -q -a)
docker run -u root -d --restart=always --network server-net -p 8181:4173 --name wireguard-admin_container wireguard-admin:latest
docker image prune -a --force
