FROM --platform=linux/x86_64 node:20.12-slim

RUN apt-get update \
&& apt-get install --no-install-recommends -y locales git procps vim tmux curl \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP

ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

WORKDIR /app
