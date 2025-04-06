import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ThumbsUp, ThumbsDown } from 'lucide-react';

const fetchAudioDrops = async (page) => {
  const response = await fetch(`https://mockapi.io/api/kukufm/audio?page=${page}`);
  const data = await response.json();
  return data;
};

const AudioCard = ({ drop }) => {
  const [liked, setLiked] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio(drop.audioUrl);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => audio.removeEventListener('ended', () => setIsPlaying(false));
  }, []);

  return (
    <Card className="bg-gradient-to-r from-yellow-100 to-orange-200 rounded-2xl shadow-md mb-6">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-bold">{drop.title}</h2>
        <p className="text-sm text-gray-600">{drop.description}</p>
        <div className="flex items-center gap-3">
          <Button onClick={togglePlay} className="rounded-full p-2">
            <Volume2 className="w-5 h-5" /> {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant={liked === 'up' ? 'default' : 'outline'}
            onClick={() => setLiked('up')}
            className="rounded-full p-2"
          >
            <ThumbsUp className="w-5 h-5" />
          </Button>
          <Button
            variant={liked === 'down' ? 'default' : 'outline'}
            onClick={() => setLiked('down')}
            className="rounded-full p-2"
          >
            <ThumbsDown className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">Voice: {drop.voice} | Language: {drop.language}</p>
      </CardContent>
    </Card>
  );
};

const KukuVersePrototype = () => {
  const [audioDrops, setAudioDrops] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreDrops = async () => {
    setLoading(true);
    const newDrops = await fetchAudioDrops(page);
    setAudioDrops((prev) => [...prev, ...newDrops]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreDrops();
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading) loadMoreDrops();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page]);

  return (
    <div className="p-6 max-w-md mx-auto">
      {audioDrops.map((drop, index) => (
        <AudioCard drop={drop} key={index} />
      ))}
      {loading && <p className="text-center text-sm">Loading more...</p>}
    </div>
  );
};

export default KukuVersePrototype;
