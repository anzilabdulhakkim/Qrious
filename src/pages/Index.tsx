import QRGenerator from '@/components/QRGenerator';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const Index = () => {
  return (
    <SmoothScrollProvider>
      <div className="flex flex-col min-h-screen bg-gradient-subtle pattern-dots">
        {/* Main content */}
        <main className="flex-grow container mx-auto py-12">
          <QRGenerator />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-4">
          <div className="container mx-auto px-6 text-center flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <span className="text-sm text-muted-foreground">
              Built with ❤️ for privacy and simplicity
            </span>
            <span className="text-sm text-muted-foreground">
              © 2025 Qrious. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
};

export default Index;
