FROM node:14.1.0-buster AS client-builder

WORKDIR /resumake-client

COPY ./app/client ./

RUN npm ci
RUN npm run build


FROM node:14.1.0-buster AS server-builder

WORKDIR /resumake-server

COPY ./app/server ./

RUN npm ci
RUN npm run build


FROM node:14.1.0-buster

# Install nginx
RUN apt-get update && apt-get install -y nginx

# Install tinytex, from https://tex.stackexchange.com/a/493882
WORKDIR /var/local
RUN wget -qO- "https://yihui.name/gh/tinytex/tools/install-unx.sh" | sh
ENV PATH="${PATH}:/root/bin"
RUN tlmgr install \
    preprint enumitem ragged2e ms fancyhdr xcolor xifthen setspace ifmtarg unicode-math tocloft titlesec \
    textpos hyphenat microtype moderncv epstopdf-pkg parskip tabu changepage babel-english sectsty isodate \
    substr xltxtra realscripts koma-script

COPY --from=client-builder /resumake-client/dist /resumake-client-bundle
COPY --from=server-builder /resumake-server /resumake-server

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /resumake-server

# TODO: startup script for nginx and node
ENTRYPOINT '/bin/bash'