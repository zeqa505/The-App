import React, { useState } from 'react';
import { usePlaylistStore } from '@/lib/stores/usePlaylistStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
  const { createPlaylist, isLoading, error, clearError } = usePlaylistStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.name.trim()) return;

    try {
      await createPlaylist(formData.name.trim(), formData.description.trim() || undefined);
      setFormData({ name: '', description: '', isPublic: false });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) clearError();
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPublic: checked
    }));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: '', description: '', isPublic: false });
      clearError();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Create a new playlist to organize your favorite songs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter playlist name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for your playlist"
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={handleSwitchChange}
                disabled={isLoading}
              />
              <Label htmlFor="isPublic" className="text-sm">
                Make playlist public
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Playlist'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}