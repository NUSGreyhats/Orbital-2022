FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

ENV FLASK_DEBUG 1

COPY . .
RUN chmod -R 777 data

RUN touch bugs.txt && chmod 666 bugs.txt

RUN useradd -ms /bin/bash web
USER web


CMD [ "python3", "app.py"]
