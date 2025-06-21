import React from 'react';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function ReplitAuthButton() {
  const { loginWithReplit, isLoading } = useAuthStore();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome to MusicStream</CardTitle>
        <CardDescription className="text-center">
          Sign in with your Replit account to start streaming music
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={loginWithReplit}
          className="w-full"
          disabled={isLoading}
          size="lg"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Continue with Replit
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          You'll be redirected to Replit to authenticate your account
        </p>
      </CardContent>
    </Card>
  );
}