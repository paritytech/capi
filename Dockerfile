ARG DENO_VERSION=1.29.1

FROM denoland/deno:${DENO_VERSION} as vscode

ARG POLKADOT_VERSION=v0.9.36

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y unzip curl git \
  && curl -L -o /usr/local/bin/polkadot https://github.com/paritytech/polkadot/releases/download/${POLKADOT_VERSION}/polkadot \
  && chmod +x /usr/local/bin/polkadot \
  && curl -fsSL https://dprint.dev/install.sh | DPRINT_INSTALL=/usr/local sh \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm -g install cspell@latest \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

FROM vscode as dev
RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y zsh

FROM vscode as gitpod

# Gitpod creates a gitpod user to run without privileges
# following https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ENV DENO_DIR=/home/gitpod/.cache/deno
