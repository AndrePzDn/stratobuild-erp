import requests

GRAFANA_URL = "http://localhost:5000"
USER = "admin"
PASSWORD = "admin"

def provision_dashboard():
    url = f"{GRAFANA_URL}/api/dashboards/db"
    
    dashboard = {
      "uid": "master-bi-dashboard",
      "title": "Master F-Layout Analytics",
      "timezone": "browser",
      "schemaVersion": 38,
      "templating": {
        "list": [
          {
            "name": "Proyecto",
            "type": "query",
            "datasource": "grafana-clickhouse-datasource",
            "query": "SELECT DISTINCT project_name FROM dim_project ORDER BY project_name",
            "multi": True,
            "includeAll": True
          }
        ]
      },
      "panels": [
        {
          "id": 5,
          "type": "piechart",
          "title": "Estado de Cotizaciones",
          "gridPos": {"x": 0, "y": 0, "w": 12, "h": 9},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT CASE status WHEN 'pending' THEN 'Pendiente' WHEN 'Pending' THEN 'Pendiente' WHEN 'converted' THEN 'Convertido' WHEN 'approved' THEN 'Aprobado' WHEN 'rejected' THEN 'Rechazado' WHEN 'expired' THEN 'Expirado' ELSE status END as status, count(status) as Estado FROM fact_quote WHERE (SELECT count(DISTINCT project_name) FROM dim_project WHERE project_name IN ($Proyecto)) = (SELECT count(DISTINCT project_name) FROM dim_project) AND $__timeFilter(date) GROUP BY status",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "pieType": "donut",
            "reduceOptions": {
              "values": True
            }
          },
          "fieldConfig": {
            "defaults": {},
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Pendiente"},
                "properties": [{"id": "color", "value": {"fixedColor": "#bbbbbb", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Convertido"},
                "properties": [{"id": "color", "value": {"fixedColor": "#57a54c", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Aprobado"},
                "properties": [{"id": "color", "value": {"fixedColor": "#95d88c", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Rechazado"},
                "properties": [{"id": "color", "value": {"fixedColor": "#df3346", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Expirado"},
                "properties": [{"id": "color", "value": {"fixedColor": "#ac0b1d", "mode": "fixed"}}]
              }
            ]
          }
        },
        {
          "id": 6,
          "type": "piechart",
          "title": "Estado de Tareas",
          "gridPos": {"x": 12, "y": 0, "w": 12, "h": 9},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT CASE status WHEN 'not_started' THEN 'Por Hacer' WHEN 'in_progress' THEN 'En Progreso' WHEN 'completed' THEN 'Completado' WHEN 'on_hold' THEN 'En Espera' ELSE status END as status, count(status) as Estado FROM dim_task dt JOIN dim_project dp ON dt.project_id = dp.project_id WHERE dp.project_name IN ($Proyecto) AND $__timeFilter(dt.updated) GROUP BY status",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "pieType": "donut",
            "reduceOptions": {
              "values": True
            }
          },
          "fieldConfig": {
            "defaults": {},
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Por Hacer"},
                "properties": [{"id": "color", "value": {"fixedColor": "#acacac", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "En Progreso"},
                "properties": [{"id": "color", "value": {"fixedColor": "#3573d8", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Completado"},
                "properties": [{"id": "color", "value": {"fixedColor": "#57a54c", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "En Espera"},
                "properties": [{"id": "color", "value": {"fixedColor": "#c994e4", "mode": "fixed"}}]
              }
            ]
          }
        },
        {
          "id": 1,
          "type": "barchart",
          "title": "Rentabilidad por Proyecto",
          "gridPos": {"x": 0, "y": 9, "w": 12, "h": 9},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT P.project_name as Proyecto, sumIf(FP.amount, FP.payment_type='income') - sumIf(FP.amount, FP.payment_type='expense') as Rentabilidad FROM fact_payment FP JOIN dim_project P ON FP.project_id = P.project_id WHERE P.project_name IN ($Proyecto) AND $__timeFilter(FP.date) GROUP BY Proyecto ORDER BY Rentabilidad DESC",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "orientation": "horizontal",
            "stacking": "normal"
          },
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"}
            },
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Rentabilidad"},
                "properties": [
                  {
                    "id": "thresholds",
                    "value": {
                      "mode": "absolute",
                      "steps": [
                        {"color": "#ef4444", "value": None},
                        {"color": "#10b981", "value": 0}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": 2,
          "type": "barchart",
          "title": "Margen de Ganancia por Tipos de Servicios u Obras",
          "gridPos": {"x": 12, "y": 9, "w": 12, "h": 9},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT P.project_type_name as Tipo_Servicio, (sumIf(FP.amount, FP.payment_type='income') - sumIf(FP.amount, FP.payment_type='expense')) / nullif(sumIf(FP.amount, FP.payment_type='income'), 0) * 100 as Margen FROM fact_payment FP JOIN dim_project P ON FP.project_id = P.project_id WHERE P.project_name IN ($Proyecto) AND $__timeFilter(FP.date) GROUP BY Tipo_Servicio ORDER BY Margen DESC",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "orientation": "horizontal",
            "stacking": "normal"
          },
          "fieldConfig": {
            "defaults": {
              "color": {"mode": "thresholds"}
            },
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Margen"},
                "properties": [
                  {
                    "id": "thresholds",
                    "value": {
                      "mode": "absolute",
                      "steps": [
                        {"color": "#ef4444", "value": None},
                        {"color": "#3b82f6", "value": 0}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": 3,
          "type": "table",
          "title": "Desvíos de Presupuesto y Cronograma",
          "gridPos": {"x": 0, "y": 18, "w": 12, "h": 10},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT P.project_name as Proyecto, (coalesce(PAY.gasto_real, 0) - coalesce(CF.estimated_total, 0)) as Desvio_Presupuesto, coalesce(T.status_retraso, 0) as Tareas_Retrasadas FROM dim_project P LEFT JOIN (SELECT project_id, max(estimated_total) as estimated_total FROM fact_cash_flow WHERE $__timeFilter(updated) GROUP BY project_id) CF ON P.project_id = CF.project_id LEFT JOIN (SELECT project_id, sum(amount) as gasto_real FROM fact_payment WHERE payment_type = 'expense' AND $__timeFilter(date) GROUP BY project_id) PAY ON P.project_id = PAY.project_id LEFT JOIN (SELECT project_id, count() as status_retraso FROM fact_project_task WHERE actual_end_date > estimated_end_date OR status = 'delayed' GROUP BY project_id) T ON P.project_id = T.project_id WHERE P.project_name IN ($Proyecto) ORDER BY Desvio_Presupuesto DESC",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "showHeader": True
          },
          "fieldConfig": {
            "defaults": {
               "custom": {"align": "auto"}
            },
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Desvio_Presupuesto"},
                "properties": [
                  {
                    "id": "custom.cellOptions",
                    "value": {"type": "color-text"}
                  },
                  {
                    "id": "thresholds",
                    "value": {
                      "mode": "absolute",
                      "steps": [
                        {"color": "green", "value": None},
                        {"color": "red", "value": 0.01}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": 4,
          "type": "barchart",
          "title": "Eficiencia y Utilización de Recursos",
          "gridPos": {"x": 12, "y": 18, "w": 12, "h": 10},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT R.resource_type as Recurso, sum(I.quantity) as Stock_Total, coalesce(sum(IA.cantidad_asignada), 0) as Cantidad_Asignada, round((coalesce(sum(IA.cantidad_asignada), 0) / nullif(sum(I.quantity), 0) * 100), 2) as Porcentaje_Uso FROM fact_inventory I JOIN dim_resource R ON I.resource_id = R.resource_id LEFT JOIN (SELECT FIA.inventory_id, sum(FIA.quantity) as cantidad_asignada FROM fact_inventory_assignment FIA JOIN dim_task dt ON FIA.task_id = dt.task_id JOIN dim_project dp ON dt.project_id = dp.project_id WHERE dp.project_name IN ($Proyecto) AND $__timeFilter(FIA.updated) GROUP BY FIA.inventory_id) IA ON I.inventory_id = IA.inventory_id GROUP BY Recurso HAVING Stock_Total > 0 ORDER BY Porcentaje_Uso DESC",
              "format": 1,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            }
          ],
          "options": {
            "orientation": "horizontal"
          },
          "fieldConfig": {
            "defaults": {
               "custom": {}
            },
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Stock_Total"},
                "properties": [{"id": "color", "value": {"fixedColor": "#cbd5e1", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Cantidad_Asignada"},
                "properties": [
                  {
                    "id": "thresholds",
                    "value": {
                      "mode": "percentage",
                      "steps": [
                        {"color": "#10b981", "value": None},
                        {"color": "#f59e0b", "value": 85},
                        {"color": "#ef4444", "value": 100}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": 7,
          "type": "timeseries",
          "title": "Timeline de Ingresos, Gastos y Saldo",
          "gridPos": {"x": 0, "y": 28, "w": 24, "h": 12},
          "datasource": "grafana-clickhouse-datasource",
          "targets": [
            {
              "rawSql": "SELECT fp.date as date, sum(fp.amount) as Ingresos FROM fact_payment fp JOIN dim_project p ON fp.project_id=p.project_id WHERE p.project_name IN ($Proyecto) AND $__timeFilter(fp.date) AND fp.payment_type = 'income' GROUP BY fp.date ORDER BY date ASC",
              "format": 0,
              "editorType": "sql",
              "queryType": "table",
              "refId": "A"
            },
            {
              "rawSql": "SELECT fp.date as date, sum(fp.amount) as Gastos FROM fact_payment fp JOIN dim_project p ON fp.project_id=p.project_id WHERE p.project_name IN ($Proyecto) AND $__timeFilter(fp.date) AND fp.payment_type = 'expense' GROUP BY fp.date ORDER BY date ASC",
              "format": 0,
              "editorType": "sql",
              "queryType": "table",
              "refId": "B"
            },
            {
              "rawSql": "SELECT date, sum(sumIf(amount, payment_type = 'income') - sumIf(amount, payment_type = 'expense')) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Saldo FROM fact_payment fp JOIN dim_project p on fp.project_id=p.project_id WHERE p.project_name IN ($Proyecto) AND $__timeFilter(fp.date) GROUP BY date ORDER BY date",
              "format": 0,
              "editorType": "sql",
              "queryType": "table",
              "refId": "C"
            }
          ],
          "options": {
            "legend": {"displayMode": "list", "placement": "bottom", "showLegend": True}
          },
          "fieldConfig": {
            "defaults": {
              "custom": {
                "fillOpacity": 30,
                "lineWidth": 1,
                "gradientMode": "opacity",
                "drawStyle": "line",
                "pointSize": 5,
                "showPoints": "always"
              }
            },
            "overrides": [
              {
                "matcher": {"id": "byName", "options": "Ingresos"},
                "properties": [{"id": "color", "value": {"fixedColor": "#57a54c", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Gastos"},
                "properties": [{"id": "color", "value": {"fixedColor": "#dfb300", "mode": "fixed"}}]
              },
              {
                "matcher": {"id": "byName", "options": "Saldo"},
                "properties": [
                  {"id": "color", "value": {"mode": "thresholds"}},
                  {"id": "displayName", "value": "Saldo"},
                  {
                    "id": "thresholds",
                    "value": {
                      "mode": "absolute",
                      "steps": [
                        {"color": "#df3346", "value": None},
                        {"color": "#3573d8", "value": 0}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }

    payload = {
        "dashboard": dashboard,
        "overwrite": True
    }
    
    resp = requests.post(url, json=payload, auth=(USER, PASSWORD))
    if resp.status_code in [200, 201]:
        print("Master Dashboard provisioned successfully.")
        print(resp.json())
    else:
        print("Failed to provision dashboard:", resp.status_code, resp.text)

if __name__ == "__main__":
    provision_dashboard()
