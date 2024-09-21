# Параметры для подключения по SSH
SSH_USER=root
SSH_HOST=147.45.245.104

.PHONY: remove-container docker-compose-up clone copy deploy clean status logs restart-container update-images backup

# Параметры репозитория
BRANCH=main

# Имя контейнера (или сервиса в docker-compose.yml)
CONTAINER_NAME=wireguard-web

# Цель по умолчанию
all: deploy

# Переменная для использования SSH
USE_SSH=$(filter ssh,$(MAKECMDGOALS))

# Префикс для команд (локально или по SSH)
CMD_PREFIX=$(if $(USE_SSH),ssh $(SSH_USER)@$(SSH_HOST),)

# Локальная директория проекта
LOCAL_PROJECT_DIR=.

# Директория проекта только для SSH
SSH_PROJECT_DIR=development/wireguard-web

# Директория проекта (локально или по SSH)
PROJECT_DIR=$(if $(USE_SSH),$(SSH_PROJECT_DIR),$(LOCAL_PROJECT_DIR))

# Комплексное правило для деплоя
deploy: copy remove-container docker-compose-up

# Очистка проекта на удаленном сервере (всегда по SSH)
clean:
	ssh $(SSH_USER)@$(SSH_HOST) rm -rf $(SSH_PROJECT_DIR)

# Правило для копирования проекта из текущей папки
copy:
	ssh $(SSH_USER)@$(SSH_HOST) 'mkdir -p $(SSH_PROJECT_DIR)' && \
	rsync -avz --delete --exclude-from='.gitignore' $(LOCAL_PROJECT_DIR)/ $(SSH_USER)@$(SSH_HOST):$(SSH_PROJECT_DIR)

# Правило для остановки и удаления запущенного контейнера
remove-container:
	@if [ "$$($(CMD_PREFIX) docker ps -f name=wireguard-web -q -a)" != "" ]; then \
		$(CMD_PREFIX) docker rm --force $$($(CMD_PREFIX) docker ps -f name=wireguard-web -q -a); \
	fi

# Правило для запуска Docker Compose
docker-compose-up:
	$(if $(USE_SSH),$(CMD_PREFIX) 'cd $(PROJECT_DIR) && docker compose up --no-deps --build --force-recreate',docker compose up --no-deps --build --force-recreate)

# Проверка состояния контейнеров
status:
	$(CMD_PREFIX) docker ps -a

# Просмотр логов контейнера
logs:
	$(CMD_PREFIX) docker logs $(CONTAINER_NAME)

# Перезапуск контейнера
restart-container:
	$(CMD_PREFIX) docker restart $(CONTAINER_NAME)

# Создание резервной копии проекта
backup:
	$(CMD_PREFIX) tar czf $(PROJECT_DIR)_backup_$(shell date +%Y%m%d%H%M%S).tar.gz -C $(PROJECT_DIR) .

# Убрать --ssh из целей make
%:
	@:
