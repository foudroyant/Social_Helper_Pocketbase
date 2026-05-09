FROM alpine:latest

WORKDIR /app

# installer wget/unzip
RUN apk add --no-cache unzip wget

# télécharger pocketbase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.37.4/pocketbase_0.37.4_linux_amd64.zip \
    && unzip pocketbase_0.37.4_linux_amd64.zip \
    && rm pocketbase_0.37.4_linux_amd64.zip

# Copier les données (optionnel au début)
COPY pb_public /app/pb_public
COPY pb_hooks /app/pb_hooks
COPY pb_migrations /app/pb_migrations

# Donner les permissions
RUN chmod +x /app/pocketbase

EXPOSE 8090

CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8090"]