FROM node:14.1.0-buster

# Install tinytex, from https://tex.stackexchange.com/a/493882
WORKDIR /var/local
RUN wget -qO- "https://yihui.name/gh/tinytex/tools/install-unx.sh" | sh
ENV PATH="${PATH}:/root/bin"
RUN tlmgr install preprint enumitem ragged2e ms fancyhdr xcolor xifthen setspace ifmtarg unicode-math tocloft titlesec textpos hyphenat microtype moderncv epstopdf-pkg parskip tabu changepage babel-english sectsty isodate substr xltxtra realscripts koma-script
 
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
