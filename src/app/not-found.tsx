import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-display">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-8">
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
