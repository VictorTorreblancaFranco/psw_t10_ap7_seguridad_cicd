#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


CONFIDENCE = {"0": "Falso positivo", "1": "Baja", "2": "Media", "3": "Alta", "4": "Confirmada"}


def plain_text(value):
    return re.sub(r"<[^>]+>", " ", str(value)).replace("&quot;", '"').strip()


def main():
    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    report = json.loads(source.read_text(encoding="utf-8"))
    alerts = [alert for site in report.get("site", []) for alert in site.get("alerts", [])]
    alerts.sort(key=lambda item: int(item.get("riskcode", 0)), reverse=True)

    lines = ["# Resumen de hallazgos OWASP ZAP", ""]
    for index, alert in enumerate(alerts[:10], start=1):
        instances = alert.get("instances", [])
        uri = instances[0].get("uri", "N/D") if instances else "N/D"
        risk = str(alert.get("riskdesc", "N/D")).split(" ")[0]
        confidence = CONFIDENCE.get(str(alert.get("confidence", "")), "N/D")
        lines.extend(
            [
                f"## {index}. {alert.get('name', 'Alerta sin nombre')}",
                f"- Riesgo: {risk}",
                f"- Confianza: {confidence}",
                f"- URL de ejemplo: {uri}",
                f"- Solución: {plain_text(alert.get('solution', 'Revisar configuración.'))}",
                "",
            ]
        )

    target.write_text("\n".join(lines), encoding="utf-8")
    print(f"Resumen generado en {target}")


if __name__ == "__main__":
    main()

