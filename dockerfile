# Download base image ubuntu 22.04
FROM node:18

# LABEL about the custom image
LABEL maintainer="akrck02@gmail.com"
LABEL version="0.1"
LABEL description="This is a custom Docker Image for mewbot execution"

# Create app directory
WORKDIR /home/app

# install git
RUN apt-get update && apt-get install -y git

# Create app directory
WORKDIR /home/app/mewbot

# Clone the mewbot repository
CMD ["sh","start.sh"]