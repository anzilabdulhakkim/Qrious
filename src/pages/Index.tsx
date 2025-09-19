import React from 'react';
import QRGenerator from '@/components/QRGenerator';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const Index = () => {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-gradient-subtle pattern-dots">
        <main className="container mx-auto py-12">
          <QRGenerator />
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Built with ❤️ for privacy and simplicity
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                © 2025 Qrious. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
};

export default Index;
