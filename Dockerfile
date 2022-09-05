FROM mcr.microsoft.com/vscode/devcontainers/rust:0-1

RUN rustup target add wasm32-unknown-unknown

# crates.io index update fails without this (https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=918854)
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true

USER vscode

RUN /bin/bash -c 'curl -fsSL https://deno.land/x/install/install.sh | sh \
  && curl -fsSL https://dprint.dev/install.sh | sh \
  && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
  && export NVM_DIR=$HOME/.nvm \
  && . $NVM_DIR/nvm.sh \
  && nvm install --lts \
  && npm -g install cspell@latest'

ENV DENO_INSTALL=/home/vscode/.deno
ENV PATH=$DENO_INSTALL/bin:$PATH
ENV DPRINT_INSTALL=/home/vscode/.dprint
ENV PATH=$DPRINT_INSTALL/bin:$PATH
