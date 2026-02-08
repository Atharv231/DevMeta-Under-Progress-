FROM node:20

WORKDIR /app

# 🔒 NEW: Prevent npm from creating _logs & debug files
ENV NPM_CONFIG_LOGLEVEL=silent

# 🔒 NEW: Prevent npm cache writing on host system
ENV NPM_CONFIG_CACHE=false

RUN apt-get update && apt-get install -y bash

CMD ["bash"]
