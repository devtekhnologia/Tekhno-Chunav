FROM python:3.10-slim

RUN mkdir /Demo

WORKDIR /Demo

ADD . /Demo

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
