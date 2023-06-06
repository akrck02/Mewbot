# Download base image ubuntu 22.04
FROM node:18

# LABEL about the custom image
LABEL maintainer="akrck02@gmail.com"
LABEL version="0.1"
LABEL description="This is a custom Docker Image for mewbot execution"

# Create app directory
WORKDIR /home/app

# Copy start.sh script and define default command for the container
COPY ./start.sh /home/app/start.sh
CMD ["sh","/home/app/start.sh"]