FROM mcr.microsoft.com/vscode/devcontainers/rust:0-1
RUN rustup target add wasm32-unknown-unknown
ENV DENO_INSTALL=/usr/local
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN export PATH=/usr/local/cargo/bin:$PATH
RUN cargo install dprint
