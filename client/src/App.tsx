import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { usePlaylistStore } from '@/lib/stores/usePlaylistStore';
import { AuthPage } from '@/pages/AuthPage';
import { SearchPage } from '@/pages/SearchPage';
import { PlaylistsPage } from '@/pages/PlaylistsPage';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Music, LogOut } from 'lucide-react';
import '@fontsource/inter';

type AppPage = 'search' | 'playlists';

function App() {
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const { fetchPlaylists } = usePlaylistStore();
  const [currentPage, setCurrentPage] = useState<AppPage>('search');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated, fetchPlaylists]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { id: 'search' as AppPage, label: 'Search', icon: Search },
    { id: 'playlists' as AppPage, label: 'Playlists', icon: Music },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage />;
      case 'playlists':
        return <PlaylistsPage />;
      default:
        return <SearchPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold">MusicStream</h1>
              <nav className="flex space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      onClick={() => setCurrentPage(item.id)}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {renderCurrentPage()}
      </main>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  );
}

export default App;
