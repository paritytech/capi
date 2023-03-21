
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/base:0-${VARIANT}

ARG DENO_VERSION=1.31.1
ARG POLKADOT_VERSION=v0.9.37
ARG POLKADOT_PARACHAIN_VERSION=v0.9.370
ARG ZOMBIENET_VERSION=v1.3.37
ARG SUBSTRATE_CONTRACTS_NODE_VERSION=v0.24.0

ENV DENO_INSTALL=/deno
ENV DENO_INSTALL_ROOT=/usr/local

RUN mkdir -p ${DENO_INSTALL} \
    && curl -fsSL https://deno.land/x/install/install.sh | sh -s v${DENO_VERSION} \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=/home/vscode/.cache/deno
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# See https://github.com/lucacasonato/deno-puppeteer/blob/main/Dockerfile for
# pupeeter related dependencies

RUN export DEBIAN_FRONTEND=noninteractive \
  apt-get -qq update \
  && apt-get -qq install -y --no-install-recommends \
    chromium \
    curl \
    fonts-liberation \
    git \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    procps \
    unzip \
    wget \
    xdg-utils \
  && PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts \
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
