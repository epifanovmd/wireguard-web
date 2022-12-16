# Wireguard Admin

##### Stack:
  - Typescript
  - React
  - Styled Components
  - Vite

### Installation
```sh
$ git clone https://github.com/epifanovmd/wireguard-web.git
$ cd wireguard-web
$ yarn
```

### Run
```sh
$ yarn dev
```
```sh
Application listening on: http://localhost:3000
```

### Start app in docker container (with Server Side Rendering)
```sh
$ docker build -f Dockerfile -t wireguard-web:latest .
$ [[ $(docker ps -f name=wireguard-web_container -q -a) != '' ]] && docker rm --force $(docker ps -f name=wireguard-web_container -q -a)
$ docker run -u root -d --restart=always --network server-net -p 3000:4173 --name wireguard-web_container wireguard-web:latest
$ docker image prune -a --force
```

```sh
Application listening on: http://localhost:3000
```

License
----

MIT

**Free Software, Good Work!**
