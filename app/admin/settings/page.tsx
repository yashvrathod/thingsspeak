'use client'

import { useState } from 'react'
import { Save, Bell, Shield, Database } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'IoT Admin Panel',
    description: 'Simple, elegant IoT data management platform',
    timezone: 'UTC',
    emailNotifications: true,
    securityAlerts: true,
    weeklyReports: false,
    dataRetention: '90',
    apiRateLimit: '1000',
    maxDevices: '10000',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage platform settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Database className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">General</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Platform Name</label>
          <input
            type="text"
            value={settings.platformName}
            onChange={(e) => handleChange('platformName', e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="CST">Central Time</option>
            <option value="MST">Mountain Time</option>
            <option value="PST">Pacific Time</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about platform activity' },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Get notified about security events' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) => handleChange(item.key, e.target.checked)}
                className="rounded border-border mt-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security & Limits */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Security & Limits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Retention (days)</label>
            <input
              type="number"
              value={settings.dataRetention}
              onChange={(e) => handleChange('dataRetention', e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Rate Limit (req/min)</label>
            <input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => handleChange('apiRateLimit', e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Max Devices per Project</label>
            <input
              type="number"
              value={settings.maxDevices}
              onChange={(e) => handleChange('maxDevices', e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}
