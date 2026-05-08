import requests
import json
import os

GRAFANA_URL = "http://localhost:5000"
USER = "admin"
PASSWORD = "admin"

def provision_datasource():
    url = f"{GRAFANA_URL}/api/datasources"
    payload = {
        "name": "grafana-clickhouse-datasource",
        "type": "grafana-clickhouse-datasource",
        "access": "proxy",
        "url": "",
        "isDefault": True,
        "jsonData": {
            "host": "clickhouse",
            "port": 8123,
            "protocol": "http",
            "username": "default"
        }
    }
    
    resp = requests.get(f"{GRAFANA_URL}/api/datasources/name/grafana-clickhouse-datasource", auth=(USER, PASSWORD))
    if resp.status_code == 200:
        print("Datasource 'ClickHouse' already exists. Updating...")
        ds_id = resp.json()['id']
        update_resp = requests.put(f"{url}/{ds_id}", json=payload, auth=(USER, PASSWORD))
        print("Update response:", update_resp.status_code)
        return
        
    resp = requests.post(url, json=payload, auth=(USER, PASSWORD))
    if resp.status_code in [200, 201]:
        print("Datasource 'ClickHouse' provisioned successfully.")
    else:
        print("Failed to provision datasource:", resp.status_code, resp.text)

def provision_dashboard():
    url = f"{GRAFANA_URL}/api/dashboards/db"
    
    dashboard = {
      "uid": "bi-dashboard-001",
      "title": "Descriptive BI Dashboard",
      "timezone": "browser",
      "schemaVersion": 38,
      "panels": [
        {
          "id": 1,
          "type": "piechart",
          "title": "Estados de Cotizaciones",
          "gridPos": {"x": 0, "y": 0, "w": 12, "h": 8},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT status as label, count() as count FROM fact_quote GROUP BY status",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {"pieType": "donut"}
        },
        {
          "id": 2,
          "type": "piechart",
          "title": "Estado de Tareas",
          "gridPos": {"x": 12, "y": 0, "w": 12, "h": 8},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT status as label, count() as count FROM fact_project_task GROUP BY status",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {"pieType": "donut"}
        },
        {
          "id": 3,
          "type": "barchart",
          "title": "Rentabilidad Mensual",
          "gridPos": {"x": 0, "y": 8, "w": 12, "h": 8},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT toStartOfMonth(date) as time_period, sumIf(amount, payment_type = 'income') - sumIf(amount, payment_type = 'expense') as rentability FROM fact_payment GROUP BY time_period ORDER BY time_period",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "fieldConfig": {
            "defaults": {
              "custom": {"axisPlacement": "left"}
            }
          }
        },
        {
          "id": 4,
          "type": "barchart",
          "title": "Utilidad por Proyecto",
          "gridPos": {"x": 12, "y": 8, "w": 12, "h": 8},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT P.project_name as project, sumIf(PM.amount, PM.payment_type = 'income') - sumIf(PM.amount, PM.payment_type = 'expense') as utility FROM fact_payment PM JOIN dim_project P ON PM.project_id = P.project_id GROUP BY project ORDER BY utility DESC",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ]
        },
        {
          "id": 5,
          "type": "timeseries",
          "title": "Evolución de Ingresos",
          "gridPos": {"x": 0, "y": 16, "w": 24, "h": 8},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT toStartOfMonth(date) as time_period, sum(amount) as income FROM fact_payment WHERE payment_type = 'income' GROUP BY time_period ORDER BY time_period",
              "format": 0,
              "editorType": "sql",
              "queryType": "timeseries",
              "refId": "A"
            }
          ]
        }
      ]
    }

    payload = {
        "dashboard": dashboard,
        "overwrite": True
    }
    
    resp = requests.post(url, json=payload, auth=(USER, PASSWORD))
    if resp.status_code in [200, 201]:
        print("Dashboard provisioned successfully.")
        print(resp.json())
    else:
        print("Failed to provision dashboard:", resp.status_code, resp.text)

if __name__ == "__main__":
    provision_datasource()
    provision_dashboard()
