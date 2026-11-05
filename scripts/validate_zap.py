#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


RISK_ORDER = {"Informational": 0, "Low": 1, "Medium": 2, "High": 3}


def alerts_from_report(report):
    alerts = []
    for site in report.get("site", []):
        alerts.extend(site.get("alerts", []))
    return alerts


def main():
    parser = argparse.ArgumentParser(description="Valida el umbral de riesgo de un reporte ZAP JSON.")
    parser.add_argument("report", type=Path)
    parser.add_argument("--fail-at", default="High", choices=RISK_ORDER)
    args = parser.parse_args()

    data = json.loads(args.report.read_text(encoding="utf-8"))
    alerts = alerts_from_report(data)
    counts = {risk: 0 for risk in RISK_ORDER}
    blockers = []

    for alert in alerts:
        risk = str(alert.get("riskdesc", "Informational")).split(" ")[0]
        risk = risk if risk in RISK_ORDER else "Informational"
        counts[risk] += 1
        if RISK_ORDER[risk] >= RISK_ORDER[args.fail_at]:
            blockers.append((risk, alert.get("name", "Alerta sin nombre")))

    print("Resumen OWASP ZAP:", ", ".join(f"{risk}={counts[risk]}" for risk in RISK_ORDER))
    if blockers:
        for risk, name in blockers:
            print(f"BLOQUEO: [{risk}] {name}")
        raise SystemExit(1)

    print(f"Quality Gate aprobado: no existen alertas {args.fail_at} o superiores.")


if __name__ == "__main__":
    main()

