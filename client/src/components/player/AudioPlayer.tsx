import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/lib/stores/usePlayerStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeat,
    updateCurrentTime,
    updateDuration,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Audio element event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        updateCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      updateDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isDragging, isPlaying, repeat, next, updateCurrentTime, updateDuration]);

  // Update audio src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.url;
    audio.load();
  }, [currentSong]);

  // Control playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Update current time when seeking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isDragging) return;

    audio.currentTime = currentTime;
  }, [currentTime, isDragging]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    seek(newTime);
    
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleRepeatClick = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (repeat === 'one') return Repeat1;
    return Repeat;
  };

  const RepeatIcon = getRepeatIcon();

  if (!currentSong) {
    return null;
  }

  return (
    <div className="bg-background border-t p-4">
      <audio ref={audioRef} preload="metadata" />
      
      {/* Song Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {currentSong.coverArt && (
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShuffle}
          className={shuffle ? 'text-primary' : 'text-muted-foreground'}
        >
          <Shuffle className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={previous}>
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={handlePlayPause}
          className="rounded-full w-12 h-12"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button variant="ghost" size="sm" onClick={next}>
          <SkipForward className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRepeatClick}
          className={repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}
        >
          <RepeatIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button variant="ghost" size="sm" onClick={toggleMute}>
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
}