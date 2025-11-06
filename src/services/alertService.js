const ALERT_THRESHOLDS = {
  Temperature: { warning: 80, danger: 100 },
  OilLevel: { warning: 85, danger: 70 },
  OutputVoltage: { warning: { min: 30, max: 35 }, danger: { min: 25, max: 40 } },
  OutputCurrent: { warning: 0.15, danger: 0.2 },
  H2: { warning: 0.02, danger: 0.05 },
  CO: { warning: 0.03, danger: 0.06 },
  CH4: { warning: 0.03, danger: 0.06 }
};

export class AlertService {
  static checkAlerts(transformerData) {
    if (!transformerData) return [];
    
    const alerts = [];
    const { 
      Temperature, 
      OilLevel, 
      OutputVoltage, 
      OutputCurrent, 
      H2, 
      CO, 
      CH4 
    } = transformerData;

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

    // Voltage alerts
    if (OutputVoltage < ALERT_THRESHOLDS.OutputVoltage.danger.min || OutputVoltage > ALERT_THRESHOLDS.OutputVoltage.danger.max) {
      alerts.push({
        parameter: 'OutputVoltage',
        severity: 'error',
        message: `Critical: Voltage out of range (${OutputVoltage} V)`,
        value: OutputVoltage,
        timestamp: new Date()
      });
    } else if (OutputVoltage < ALERT_THRESHOLDS.OutputVoltage.warning.min || OutputVoltage > ALERT_THRESHOLDS.OutputVoltage.warning.max) {
      alerts.push({
        parameter: 'OutputVoltage',
        severity: 'warning',
        message: `Warning: Voltage deviation (${OutputVoltage} V)`,
        value: OutputVoltage,
        timestamp: new Date()
      });
    }

    // Current alerts
    if (OutputCurrent >= ALERT_THRESHOLDS.OutputCurrent.danger) {
      alerts.push({
        parameter: 'OutputCurrent',
        severity: 'error',
        message: `Critical: High current (${OutputCurrent} A)`,
        value: OutputCurrent,
        timestamp: new Date()
      });
    } else if (OutputCurrent >= ALERT_THRESHOLDS.OutputCurrent.warning) {
      alerts.push({
        parameter: 'OutputCurrent',
        severity: 'warning',
        message: `Warning: Elevated current (${OutputCurrent} A)`,
        value: OutputCurrent,
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