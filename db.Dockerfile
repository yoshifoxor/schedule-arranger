FROM postgres:16.1

RUN apt-get update \
&& apt-get install --no-install-recommends -y curl locales \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP

USER postgres

ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo
