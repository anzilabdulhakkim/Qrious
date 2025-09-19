import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Download, Copy, QrCode, Link, Mail, MessageSquare, Phone, Wifi, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRLoading from "@/components/ui/qr-loading";

interface QRData {
  type: 'url' | 'text' | 'email' | 'sms' | 'phone' | 'wifi' | 'location';
  content: string;
  title?: string;
  body?: string;
  subject?: string;
  ssid?: string;
  password?: string;
  security?: string;
  latitude?: string;
  longitude?: string;
}

const QRGenerator: React.FC = () => {
  const [qrData, setQrData] = useState<QRData>({ type: 'url', content: 'https://example.com' });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const typeIcons = {
    url: Link,
    text: MessageSquare,
    email: Mail,
    sms: MessageSquare,
    phone: Phone,
    wifi: Wifi,
    location: MapPin,
  };

  const generateQRString = (data: QRData): string => {
    switch (data.type) {
      case 'url':
        return data.content;
      case 'text':
        return data.content;
      case 'email':
        return `mailto:${data.content}${data.subject ? `?subject=${encodeURIComponent(data.subject)}` : ''}${data.body ? `${data.subject ? '&' : '?'}body=${encodeURIComponent(data.body)}` : ''}`;
      case 'sms':
        return `sms:${data.content}${data.body ? `?body=${encodeURIComponent(data.body)}` : ''}`;
      case 'phone':
        return `tel:${data.content}`;
      case 'wifi':
        return `WIFI:T:${data.security || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};H:false;;`;
      case 'location':
        return `geo:${data.latitude || '0'},${data.longitude || '0'}`;
      default:
        return data.content;
    }
  };

  const generateQR = async () => {
    if (!qrData.content.trim() && qrData.type !== 'wifi' && qrData.type !== 'location') {
      toast({
        title: "Content required",
        description: "Please enter content to generate a QR code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const qrString = generateQRString(qrData);
      const url = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
      
      // Ensure minimum 2 seconds loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      
      setTimeout(() => {
        setQrCodeUrl(url);
        setIsLoading(false);
      }, remainingTime);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      
      // Still respect minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      
      setTimeout(() => {
        toast({
          title: "Generation failed",
          description: "Failed to generate QR code. Please check your input.",
          variant: "destructive",
        });
        setIsLoading(false);
      }, remainingTime);
    }
  };

  const downloadQR = async (format: 'png' | 'svg') => {
    if (!qrCodeUrl && format !== 'svg') return;

    try {
      if (format === 'png') {
        if (qrRef.current) {
          const canvas = await html2canvas(qrRef.current, {
            backgroundColor: '#FFFFFF',
            scale: 3,
          });
          const link = document.createElement('a');
          link.download = `qrious-qr-code.${format}`;
          link.href = canvas.toDataURL();
          link.click();
        }
      } else {
        const qrString = generateQRString(qrData);
        const svgString = await QRCode.toString(qrString, {
          type: 'svg',
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `qrious-qr-code.${format}`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }
      
      toast({
        title: "Download successful",
        description: `QR code downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Download failed",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateQRString(qrData));
      toast({
        title: "Copied to clipboard",
        description: "QR code content copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };


  const renderInputFields = () => {
    const Icon = typeIcons[qrData.type];
    
    switch (qrData.type) {
      case 'url':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="url" className="text-sm font-medium">URL</Label>
            </div>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={qrData.content}
              onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
              className="transition-all duration-200"
            />
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="text" className="text-sm font-medium">Text</Label>
            </div>
            <Textarea
              id="text"
              placeholder="Enter your text here..."
              value={qrData.content}
              onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
              rows={3}
              className="transition-all duration-200"
            />
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Email</Label>
            </div>
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={qrData.content}
              onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
              className="transition-all duration-200"
            />
            <Input
              placeholder="Subject (optional)"
              value={qrData.subject || ''}
              onChange={(e) => setQrData({ ...qrData, subject: e.target.value })}
              className="transition-all duration-200"
            />
            <Textarea
              placeholder="Message body (optional)"
              value={qrData.body || ''}
              onChange={(e) => setQrData({ ...qrData, body: e.target.value })}
              rows={3}
              className="transition-all duration-200"
            />
          </div>
        );
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">WiFi Network</Label>
            </div>
            <Input
              placeholder="Network name (SSID)"
              value={qrData.ssid || ''}
              onChange={(e) => setQrData({ ...qrData, ssid: e.target.value })}
              className="transition-all duration-200"
            />
            <Input
              type="password"
              placeholder="Password"
              value={qrData.password || ''}
              onChange={(e) => setQrData({ ...qrData, password: e.target.value })}
              className="transition-all duration-200"
            />
            <Select value={qrData.security || 'WPA'} onValueChange={(value) => setQrData({ ...qrData, security: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Security type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No Password</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium capitalize">{qrData.type}</Label>
            </div>
            <Input
              placeholder={`Enter ${qrData.type}...`}
              value={qrData.content}
              onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
              className="transition-all duration-200"
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-slide-up">
        <div className="flex items-center justify-center space-x-3">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Qrious
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fast, modern, and privacy-focused QR code generation. All processing happens locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="animate-fade-in bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Generate QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">QR Code Type</Label>
              <Select value={qrData.type} onValueChange={(value: QRData['type']) => setQrData({ type: value, content: '' })}>
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Website URL</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="wifi">WiFi Network</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderInputFields()}
            
            <Button 
              onClick={generateQR} 
              className="w-full"
              disabled={isLoading}
            >
              <QrCode className="h-4 w-4 mr-2" />
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="animate-fade-in bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div 
                ref={qrRef}
                className="qr-code-container p-6 animate-scale-in"
                style={{ minHeight: '280px' }}
              >
                {isLoading ? (
                  <QRLoading />
                ) : qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Generated QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 w-64 border-2 border-dashed border-muted rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>QR code will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {qrCodeUrl && (
              <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
                <Button 
                  onClick={() => downloadQR('png')} 
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>PNG</span>
                </Button>
                <Button 
                  onClick={() => downloadQR('svg')} 
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>SVG</span>
                </Button>
                <Button 
                  onClick={copyToClipboard} 
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Privacy Note */}
      <div className="text-center text-sm text-muted-foreground animate-fade-in">
        <p>🔒 Privacy-first: All QR codes are generated locally in your browser. No data is sent to our servers.</p>
      </div>
    </div>
  );
};

export default QRGenerator;