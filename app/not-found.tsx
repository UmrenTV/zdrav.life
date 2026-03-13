import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          {/* 404 */}
          <div className="text-8xl md:text-9xl font-heading font-bold text-primary/20 mb-4">
            404
          </div>

          <h1 className="text-heading-1 font-heading font-bold mb-4">
            Page Not Found
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Suggestions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 p-4 bg-card border rounded-xl hover:border-primary/50 transition-colors"
            >
              <Home className="h-5 w-5 text-primary" />
              <span className="font-medium">Go Home</span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 p-4 bg-card border rounded-xl hover:border-primary/50 transition-colors"
            >
              <Search className="h-5 w-5 text-primary" />
              <span className="font-medium">Explore Blog</span>
            </Link>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
