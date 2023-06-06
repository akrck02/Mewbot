# Download base image ubuntu 22.04
FROM node:18

# LABEL about the custom image
LABEL maintainer="akrck02@gmail.com"
LABEL version="0.1"
LABEL description="This is a custom Docker Image for mewbot execution"

RUN mkdir -p /home/app/mewbot

# Create app directory
WORKDIR /home/app

# install git
RUN apt-get update && apt-get install -y git

# Create app directory
WORKDIR /home/app/mewbot

# Clone the mewbot repository
COPY start.sh /home/app/mewbot/start.sh
CMD ["sh","start.sh"]