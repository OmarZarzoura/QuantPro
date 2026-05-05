export type AlertType = 'signal' | 'sentiment' | 'system';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  timestamp: number;
}

export interface AlertPreferences {
  enabled: boolean;
  signalAlerts: boolean;
  sentimentAlerts: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  emailAddress: string;
  smsEnabled: boolean;
  phoneNumber: string;
}

class AlertStore {
  alerts: Alert[] = [];
  preferences: AlertPreferences = {
    enabled: true,
    signalAlerts: true,
    sentimentAlerts: true,
    pushEnabled: false,
    emailEnabled: false,
    emailAddress: 'investor@quantpro.app',
    smsEnabled: false,
    phoneNumber: '+1 555-0198'
  };
  
  listeners: ((alerts: Alert[]) => void)[] = [];
  prefListeners: ((prefs: AlertPreferences) => void)[] = [];
  newAlertListeners: ((alert: Alert) => void)[] = [];

  constructor() {
    try {
      const storedDb = localStorage.getItem('quantpro_alerts');
      if (storedDb) this.alerts = JSON.parse(storedDb);
      
      const storedPrefs = localStorage.getItem('quantpro_alert_prefs');
      if (storedPrefs) {
        this.preferences = { ...this.preferences, ...JSON.parse(storedPrefs) };
      }
    } catch(e) {}
  }

  subscribe(listener: (alerts: Alert[]) => void) {
    this.listeners.push(listener);
    listener([...this.alerts]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  subscribePrefs(listener: (prefs: AlertPreferences) => void) {
    this.prefListeners.push(listener);
    listener({...this.preferences});
    return () => {
      this.prefListeners = this.prefListeners.filter(l => l !== listener);
    };
  }

  onNewAlert(listener: (alert: Alert) => void) {
    this.newAlertListeners.push(listener);
    return () => {
      this.newAlertListeners = this.newAlertListeners.filter(l => l !== listener);
    };
  }

  addAlert(alert: Omit<Alert, 'id' | 'timestamp'>) {
    if (!this.preferences.enabled) return;
    if (alert.type === 'signal' && !this.preferences.signalAlerts) return;
    if (alert.type === 'sentiment' && !this.preferences.sentimentAlerts) return;

    const newAlert = {
      ...alert,
      id: Math.random().toString(36).slice(2, 9),
      timestamp: Date.now()
    };
    
    this.alerts = [newAlert, ...this.alerts].slice(0, 100); // Keep last 100
    this.notify();
    this.newAlertListeners.forEach(l => l(newAlert));

    try { localStorage.setItem('quantpro_alerts', JSON.stringify(this.alerts)); } catch(e) {}
    
    // 1. Browser Push Notifications
    if (this.preferences.pushEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(newAlert.title, { body: newAlert.message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(newAlert.title, { body: newAlert.message });
          }
        });
      }
    }

    // 2. Email Simulations (In a real app, this dispatches to background worker)
    if (this.preferences.emailEnabled) {
      console.log(`[Email Dispatch] Sending to ${this.preferences.emailAddress}: ${newAlert.title}`);
    }

    // 3. SMS Simulations (In a real app, uses Twilio/SNS)
    if (this.preferences.smsEnabled) {
      console.log(`[SMS Dispatch] Sending to ${this.preferences.phoneNumber}: ${newAlert.title}`);
    }
  }

  updatePrefs(newPrefs: Partial<AlertPreferences>) {
    this.preferences = { ...this.preferences, ...newPrefs };
    this.prefListeners.forEach(l => l({...this.preferences}));
    try { localStorage.setItem('quantpro_alert_prefs', JSON.stringify(this.preferences)); } catch(e) {}
  }
  
  clearAlerts() {
    this.alerts = [];
    this.notify();
    try { localStorage.setItem('quantpro_alerts', JSON.stringify(this.alerts)); } catch(e) {}
  }

  private notify() {
    this.listeners.forEach(l => l([...this.alerts]));
  }
}

export const alertStore = new AlertStore();
