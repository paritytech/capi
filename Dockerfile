FROM mcr.microsoft.com/vscode/devcontainers/rust:0-1

RUN rustup target add wasm32-unknown-unknown

ENV DENO_INSTALL=/usr/local
# crates.io index update fails without this (https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=918854)
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true

RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN curl -fsSL https://dprint.dev/install.sh | sh

RUN export PATH=/usr/local/cargo/bin:$PATH
RUN export DPRINT_INSTALL="/home/vscode/.dprint"
RUN export PATH="$DPRINT_INSTALL/bin:$PATH"
