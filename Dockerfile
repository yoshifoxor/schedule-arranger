FROM --platform=linux/x86_64 node:18.7.0-slim

RUN apt-get update \
&& apt-get install --no-install-recommends -y curl git locales procps tmux vim \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP

ENV LANG ja_JP.UTF-8
ENV TZ Asia/Tokyo

WORKDIR /app
