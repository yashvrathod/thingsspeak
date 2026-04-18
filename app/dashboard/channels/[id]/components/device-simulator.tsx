'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Play, Pause, RefreshCw, Send, Wifi, WifiOff } from 'lucide-react'

interface DeviceSimulatorProps {
  channelId: string
  writeApiKey: string
  onDataSent: () => void
}

export default function DeviceSimulator({ channelId, writeApiKey, onDataSent }: DeviceSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [intervalSeconds, setIntervalSeconds] = useState(5)
  
  // Simulated values
  const [values, setValues] = useState({
    temperature: 25,
    humidity: 60,
    pressure: 1013,
    light: 500,
  })

  const [variation, setVariation] = useState(10)
  const [autoSend, setAutoSend] = useState(false)

  const generateRandomValue = (base: number, variance: number) => {
    const change = (Math.random() - 0.5) * variance * 2
    return Math.round((base + change) * 100) / 100
  }

  const sendData = async () => {
    try {
      const payload = {
        write_api_key: writeApiKey,
        field1: generateRandomValue(values.temperature, variation),
        field2: generateRandomValue(values.humidity, variation),
        field3: generateRandomValue(values.pressure, variation / 10),
        field4: generateRandomValue(values.light, variation * 10),
        status: 'simulated',
      }

      const response = await fetch('/api/data/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success('Data sent successfully', { duration: 2000 })
        onDataSent()
      } else {
        toast.error('Failed to send data')
      }
    } catch (error) {
      console.error('Error sending data:', error)
      toast.error('Failed to send data')
    }
  }

  const toggleSimulation = () => {
    if (isSimulating) {
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      setIsSimulating(false)
      toast.info('Simulation stopped')
    } else {
      sendData() // Send immediately
      const id = setInterval(sendData, intervalSeconds * 1000)
      setIntervalId(id)
      setIsSimulating(true)
      toast.info(`Simulation started (${intervalSeconds}s interval)`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSimulating ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5" />}
            Device Simulator
          </CardTitle>
          <CardDescription>
            Simulate an IoT device sending data to this channel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Values */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Base Values</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp" className="text-xs">Temperature (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  value={values.temperature}
                  onChange={(e) => setValues({ ...values, temperature: parseFloat(e.target.value) || 0 })}
                  disabled={isSimulating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity" className="text-xs">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  value={values.humidity}
                  onChange={(e) => setValues({ ...values, humidity: parseFloat(e.target.value) || 0 })}
                  disabled={isSimulating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pressure" className="text-xs">Pressure (hPa)</Label>
                <Input
                  id="pressure"
                  type="number"
                  value={values.pressure}
                  onChange={(e) => setValues({ ...values, pressure: parseFloat(e.target.value) || 0 })}
                  disabled={isSimulating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="light" className="text-xs">Light (lux)</Label>
                <Input
                  id="light"
                  type="number"
                  value={values.light}
                  onChange={(e) => setValues({ ...values, light: parseFloat(e.target.value) || 0 })}
                  disabled={isSimulating}
                />
              </div>
            </div>
          </div>

          {/* Variation Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Random Variation</h4>
              <Badge variant="secondary">±{variation}%</Badge>
            </div>
            <Slider
              value={[variation]}
              onValueChange={(v) => setVariation(v[0])}
              max={50}
              step={1}
              disabled={isSimulating}
            />
          </div>

          {/* Interval Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Send Interval</h4>
              <Badge variant="secondary">{intervalSeconds}s</Badge>
            </div>
            <Slider
              value={[intervalSeconds]}
              onValueChange={(v) => {
                setIntervalSeconds(v[0])
                // Restart simulation if running
                if (isSimulating && intervalId) {
                  clearInterval(intervalId)
                  const id = setInterval(sendData, v[0] * 1000)
                  setIntervalId(id)
                }
              }}
              min={1}
              max={60}
              step={1}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleSimulation}
              variant={isSimulating ? 'destructive' : 'default'}
              className="flex-1"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </>
              )}
            </Button>
            <Button 
              onClick={sendData} 
              variant="outline"
              disabled={isSimulating}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Once
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Example */}
      <Card>
        <CardHeader>
          <CardTitle>API Request Example</CardTitle>
          <CardDescription>
            This is how your device would send data via HTTP POST
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <p className="text-green-600 mb-2">POST /api/data/upload</p>
            <p className="text-blue-600 mb-2">Content-Type: application/json</p>
            <pre className="text-foreground">
{JSON.stringify({
  write_api_key: writeApiKey.substring(0, 8) + '...',
  field1: values.temperature,
  field2: values.humidity,
  field3: values.pressure,
  field4: values.light,
  status: 'ok'
}, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Arduino/ESP32 Example</h4>
            <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-foreground">
{`// Example code for ESP32
void sendData() {
  HTTPClient http;
  http.begin("https://your-domain.com/api/data/upload");
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{";
  payload += "\\"write_api_key\\":\\"${writeApiKey.substring(0, 8)}...\\",";
  payload += "\\"field1\\":" + String(temperature) + ",";
  payload += "\\"field2\\":" + String(humidity);
  payload += "}";
  
  int response = http.POST(payload);
  http.end();
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
