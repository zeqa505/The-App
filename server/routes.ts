import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchMusic } from "./musicData";
import { setupReplitAuth, getCurrentUser, requireAuth, setUserSession, clearUserSession } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup custom authentication with Replit session management
  setupReplitAuth(app);

  // Custom authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({ username, email, password });
      
      // Store user in session
      const sessionId = (req as any).sessionId;
      setUserSession(sessionId, user);
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        createdAt: new Date(), 
        playlists: [] 
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Store user in session
      const sessionId = (req as any).sessionId;
      setUserSession(sessionId, user);
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        createdAt: new Date(), 
        playlists: [] 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const user = getCurrentUser(req as any);
    if (user) {
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        createdAt: new Date(), 
        playlists: [] 
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = (req as any).sessionId;
    clearUserSession(sessionId);
    res.json({ message: "Logged out successfully" });
  });

  // Search endpoint
  app.get("/api/search", (req, res) => {
    const { q: query, type = "all" } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const searchType = typeof type === "string" && ["all", "songs", "albums", "artists"].includes(type) 
      ? type as "all" | "songs" | "albums" | "artists"
      : "all";

    const results = searchMusic(query, searchType);
    res.json(results);
  });

  // Playlists endpoints
  app.get("/api/playlists", requireAuth, (req, res) => {
    res.json([]);
  });

  app.post("/api/playlists", requireAuth, (req, res) => {
    const user = getCurrentUser(req as any);
    const { name, description } = req.body;
    
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Playlist name is required" });
    }

    const newPlaylist = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: description || null,
      userId: user!.id.toString(),
      isPublic: false,
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.status(201).json(newPlaylist);
  });

  app.delete("/api/playlists/:id", requireAuth, (req, res) => {
    res.status(204).send();
  });

  app.patch("/api/playlists/:id", requireAuth, (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    res.json({ id, ...updates, updatedAt: new Date() });
  });

  app.post("/api/playlists/:id/songs", requireAuth, (req, res) => {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ error: "Song ID is required" });
    }

    res.status(201).json({ message: "Song added to playlist" });
  });

  app.delete("/api/playlists/:playlistId/songs/:songId", requireAuth, (req, res) => {
    res.status(204).send();
  });

  app.post("/api/playlists/:id/reorder", requireAuth, (req, res) => {
    const { fromIndex, toIndex } = req.body;
    if (typeof fromIndex !== "number" || typeof toIndex !== "number") {
      return res.status(400).json({ error: "Valid fromIndex and toIndex are required" });
    }

    res.json({ message: "Songs reordered successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
