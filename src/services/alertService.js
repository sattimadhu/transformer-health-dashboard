const ALERT_THRESHOLDS = {
  Temperature: { warning: 80, danger: 100 },
  OilLevel: { warning: 85, danger: 70 },
  OilMoisture: { warning: 15, danger: 20 },
  H2: { warning: 30, danger: 50 },
  CO: { warning: 50, danger: 80 },
  CH4: { warning: 25, danger: 40 },
  Voltage: { warning: { min: 10, max: 13 }, danger: { min: 9, max: 14 } },
  Current: { warning: 4, danger: 5 }
};

export class AlertService {
  static checkAlerts(transformerData) {
    if (!transformerData) return [];
    
    const alerts = [];
    const { Temperature, OilLevel, OilMoisture, H2, CO, CH4, Voltage, Current } = transformerData;

    // Temperature alerts
    if (Temperature >= ALERT_THRESHOLDS.Temperature.danger) {
      alerts.push({
        parameter: 'Temperature',
        severity: 'error',
        message: `Critical: High temperature (${Temperature}°C)`,
        value: Temperature,
        timestamp: new Date()
      });
    } else if (Temperature >= ALERT_THRESHOLDS.Temperature.warning) {
      alerts.push({
        parameter: 'Temperature',
        severity: 'warning',
        message: `Warning: Elevated temperature (${Temperature}°C)`,
        value: Temperature,
        timestamp: new Date()
      });
    }

    // Oil Level alerts
    if (OilLevel <= ALERT_THRESHOLDS.OilLevel.danger) {
      alerts.push({
        parameter: 'OilLevel',
        severity: 'error',
        message: `Critical: Low oil level (${OilLevel}%)`,
        value: OilLevel,
        timestamp: new Date()
      });
    } else if (OilLevel <= ALERT_THRESHOLDS.OilLevel.warning) {
      alerts.push({
        parameter: 'OilLevel',
        severity: 'warning',
        message: `Warning: Oil level decreasing (${OilLevel}%)`,
        value: OilLevel,
        timestamp: new Date()
      });
    }

    // Oil Moisture alerts
    if (OilMoisture >= ALERT_THRESHOLDS.OilMoisture.danger) {
      alerts.push({
        parameter: 'OilMoisture',
        severity: 'error',
        message: `Critical: High oil moisture (${OilMoisture}%)`,
        value: OilMoisture,
        timestamp: new Date()
      });
    } else if (OilMoisture >= ALERT_THRESHOLDS.OilMoisture.warning) {
      alerts.push({
        parameter: 'OilMoisture',
        severity: 'warning',
        message: `Warning: Elevated oil moisture (${OilMoisture}%)`,
        value: OilMoisture,
        timestamp: new Date()
      });
    }

    // Gas alerts
    [
      { param: 'H2', value: H2, name: 'Hydrogen' },
      { param: 'CO', value: CO, name: 'Carbon Monoxide' },
      { param: 'CH4', value: CH4, name: 'Methane' }
    ].forEach(({ param, value, name }) => {
      if (value >= ALERT_THRESHOLDS[param].danger) {
        alerts.push({
          parameter: param,
          severity: 'error',
          message: `Critical: High ${name} concentration (${value} ppm)`,
          value: value,
          timestamp: new Date()
        });
      } else if (value >= ALERT_THRESHOLDS[param].warning) {
        alerts.push({
          parameter: param,
          severity: 'warning',
          message: `Warning: Elevated ${name} level (${value} ppm)`,
          value: value,
          timestamp: new Date()
        });
      }
    });

    // Voltage alerts
    if (Voltage < ALERT_THRESHOLDS.Voltage.danger.min || Voltage > ALERT_THRESHOLDS.Voltage.danger.max) {
      alerts.push({
        parameter: 'Voltage',
        severity: 'error',
        message: `Critical: Voltage out of range (${Voltage} kV)`,
        value: Voltage,
        timestamp: new Date()
      });
    } else if (Voltage < ALERT_THRESHOLDS.Voltage.warning.min || Voltage > ALERT_THRESHOLDS.Voltage.warning.max) {
      alerts.push({
        parameter: 'Voltage',
        severity: 'warning',
        message: `Warning: Voltage deviation (${Voltage} kV)`,
        value: Voltage,
        timestamp: new Date()
      });
    }

    // Current alerts
    if (Current >= ALERT_THRESHOLDS.Current.danger) {
      alerts.push({
        parameter: 'Current',
        severity: 'error',
        message: `Critical: High current (${Current} A)`,
        value: Current,
        timestamp: new Date()
      });
    } else if (Current >= ALERT_THRESHOLDS.Current.warning) {
      alerts.push({
        parameter: 'Current',
        severity: 'warning',
        message: `Warning: Elevated current (${Current} A)`,
        value: Current,
        timestamp: new Date()
      });
    }

    return alerts;
  }

  static getStatusColor(severity) {
    switch (severity) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  }
}

export default AlertService;