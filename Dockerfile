ARG DENO_VERSION=1.25.1

FROM denoland/deno:${DENO_VERSION}

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y unzip curl git \
  && curl -fsSL https://dprint.dev/install.sh | DPRINT_INSTALL=/usr/local sh \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm -g install cspell@latest \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*
