FROM solita/ubuntu-systemd:latest

RUN apt-get update && apt-get install -y \
    snapd

ENV DISPLAY=:0

RUN apt-get install -y curl

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

RUN apt-get install -y git

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

RUN export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install 17 && nvm use 17 && npm --location=global install yarn

RUN git clone https://github.com/xcarol/wikihooku.git

RUN cd wikihooku && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && yarn

EXPOSE 8080

CMD ["/bin/bash"]
