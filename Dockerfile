
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/base:0-${VARIANT} as vscode

ARG DENO_VERSION=1.30.3
ARG POLKADOT_VERSION=v0.9.36
ARG POLKADOT_PARACHAIN_VERSION=v0.9.360
ARG ZOMBIENET_VERSION=v1.3.30
ARG SUBSTRATE_CONTRACTS_NODE_VERSION=v0.24.0

ENV DENO_INSTALL=/deno
ENV DENO_INSTALL_ROOT=/usr/local

RUN mkdir -p ${DENO_INSTALL} \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s v${DENO_VERSION} \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=/home/vscode/.cache/deno

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y unzip curl git procps \
  && curl -fsSL -o /usr/local/bin/polkadot https://github.com/paritytech/polkadot/releases/download/${POLKADOT_VERSION}/polkadot \
  && chmod +x /usr/local/bin/polkadot \
  && curl -fsSL -o /usr/local/bin/polkadot-parachain https://github.com/paritytech/cumulus/releases/download/${POLKADOT_PARACHAIN_VERSION}/polkadot-parachain \
  && chmod +x /usr/local/bin/polkadot-parachain \
  && curl -fsSL -o /usr/local/bin/zombienet-linux-x64 https://github.com/paritytech/zombienet/releases/download/${ZOMBIENET_VERSION}/zombienet-linux-x64 \
  && chmod +x /usr/local/bin/zombienet-linux-x64 \
  && curl -fsSL https://github.com/paritytech/substrate-contracts-node/releases/download/${SUBSTRATE_CONTRACTS_NODE_VERSION}/substrate-contracts-node-linux.tar.gz | tar -zx \
  && mv ./artifacts/substrate-contracts-node-linux/substrate-contracts-node /usr/local/bin/ \
  && curl -fsSL https://dprint.dev/install.sh | DPRINT_INSTALL=/usr/local sh \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm -g install cspell@latest \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

FROM vscode as gitpod

# Gitpod creates a gitpod user to run without privileges
# following https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ENV DENO_DIR=/home/gitpod/.cache/deno
