ARG DENO_VERSION=1.29.1

FROM denoland/deno:${DENO_VERSION} as vscode

ARG POLKADOT_VERSION=v0.9.36
ARG POLKADOT_PARACHAIN_VERSION=v0.9.320
ARG ZOMBIENET_VERSION=v1.3.18

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y unzip curl git procps \
  && curl -L -o /usr/local/bin/polkadot https://github.com/paritytech/polkadot/releases/download/${POLKADOT_VERSION}/polkadot \
  && chmod +x /usr/local/bin/polkadot \
  && curl -L -o /usr/local/bin/polkadot-parachain https://github.com/paritytech/cumulus/releases/download/${POLKADOT_PARACHAIN_VERSION}/polkadot-parachain \
  && chmod +x /usr/local/bin/polkadot-parachain \
  && curl -L -o /usr/local/bin/zombienet-linux https://github.com/paritytech/zombienet/releases/download/${ZOMBIENET_VERSION}/zombienet-linux \
  && chmod +x /usr/local/bin/zombienet-linux \
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
  && apt-get install -y zsh \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

FROM vscode as gitpod

# Gitpod creates a gitpod user to run without privileges
# following https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ENV DENO_DIR=/home/gitpod/.cache/deno
