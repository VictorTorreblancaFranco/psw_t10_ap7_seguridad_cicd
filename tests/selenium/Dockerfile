FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tests
COPY tests/selenium/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY tests/selenium .

CMD ["pytest", "-v", "--junitxml=/reports/junit.xml", "--html=/reports/selenium-report.html", "--self-contained-html"]

