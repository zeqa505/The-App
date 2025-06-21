import type { Express, Request, Response } from "express";

// Replit Auth configuration
const REPLIT_AUTH_URL = 'https://replit.com/auth';

export interface ReplitUser {
  id: number;
  username: string;
  email?: string;
  name?: string;
  avatar?: string;
}

// Simple session storage for custom authentication
const userSessions = new Map<string, any>();

export function setupReplitAuth(app: Express) {
  // Session middleware using Replit's infrastructure
  app.use((req: Request & { sessionId?: string; currentUser?: any }, res: Response, next) => {
    // Use Replit's session ID or create one
    const sessionId = req.headers['x-replit-user-id'] as string || 
                     req.headers['x-session-id'] as string || 
                     Math.random().toString(36);
    
    req.sessionId = sessionId;
    req.currentUser = userSessions.get(sessionId) || null;
    
    // Set session header for client
    res.setHeader('x-session-id', sessionId);
    
    next();
  });

  // Auth status endpoint
  app.get('/api/replit-auth/status', (req: Request & { replitUser?: ReplitUser }, res: Response) => {
    if (req.replitUser) {
      res.json({
        authenticated: true,
        user: req.replitUser
      });
    } else {
      res.json({
        authenticated: false,
        user: null
      });
    }
  });

  // Login redirect endpoint
  app.get('/api/replit-auth/login', (req: Request, res: Response) => {
    const returnUrl = req.query.return_url as string || '/';
    const authUrl = `${REPLIT_AUTH_URL}?return_url=${encodeURIComponent(returnUrl)}`;
    res.redirect(authUrl);
  });

  // Logout endpoint
  app.post('/api/replit-auth/logout', (req: Request, res: Response) => {
    // In Replit environment, logout is handled by the platform
    res.json({ message: 'Logged out successfully' });
  });
}

// Helper functions for session management
export function setUserSession(sessionId: string, user: any) {
  userSessions.set(sessionId, user);
}

export function clearUserSession(sessionId: string) {
  userSessions.delete(sessionId);
}

export function getCurrentUser(req: Request & { currentUser?: any }): any | null {
  return req.currentUser || null;
}

// Middleware to require authentication
export function requireAuth(req: Request & { currentUser?: any }, res: Response, next: Function) {
  if (!req.currentUser) {
    return res.status(401).json({ 
      error: 'Authentication required'
    });
  }
  next();
}