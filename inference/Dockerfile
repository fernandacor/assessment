FROM python:3.11-slim

WORKDIR /app

COPY app/ app/
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=app/inference.py
ENV FLASK_RUN_PORT=5000
ENV FLASK_RUN_HOST=0.0.0.0

EXPOSE 5000

CMD ["flask", "run"]
