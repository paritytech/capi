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

# Unset DENO_DIR set by denoland/deno base image
# so DENO_DIR defaults to the current user system cache
# This is required for non-root users to cache deno remote imports
ENV DENO_DIR=
