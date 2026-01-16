'use client';

import type { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => {
    return (
      <div className="w-full max-w-sm">
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  },
};

export const PlayerProfiles: Story = {
  render: () => {
    const players = [
      { name: 'Marcus Silva', position: 'Forward', number: 10, goals: 23 },
      { name: 'Alex Johnson', position: 'Midfielder', number: 8, goals: 12 },
      { name: 'Diego Martinez', position: 'Defender', number: 4, goals: 3 },
      { name: 'Ryan Chen', position: 'Goalkeeper', number: 1, goals: 0 },
      { name: 'Carlos Rodriguez', position: 'Forward', number: 11, goals: 18 },
    ];

    return (
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Team Roster</CardTitle>
            <CardDescription>Browse through our star players</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel>
              <CarouselContent>
                {players.map((player, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {player.number}
                            </span>
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="font-semibold">{player.name}</h3>
                            <Badge variant="secondary">{player.position}</Badge>
                            <p className="text-sm text-muted-foreground">
                              {player.goals} goals this season
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const MatchHighlights: Story = {
  render: () => {
    const highlights = [
      {
        title: 'Championship Win',
        date: 'Dec 15, 2024',
        score: '3-2',
        description: 'Thrilling victory in overtime',
      },
      {
        title: 'Season Opener',
        date: 'Jan 8, 2024',
        score: '2-1',
        description: 'Strong start to the season',
      },
      {
        title: 'Derby Match',
        date: 'Mar 22, 2024',
        score: '4-0',
        description: 'Dominant performance',
      },
      {
        title: 'Cup Final',
        date: 'May 5, 2024',
        score: '2-2 (5-4 pens)',
        description: 'Won on penalties',
      },
    ];

    return (
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Match Highlights</CardTitle>
            <CardDescription>Our best moments this season</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {highlights.map((match, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{match.title}</h3>
                              <p className="text-sm text-muted-foreground">{match.date}</p>
                            </div>
                            <Badge className="text-lg px-3 py-1">{match.score}</Badge>
                          </div>
                          <p className="text-muted-foreground">{match.description}</p>
                          <Button variant="outline" className="w-full">
                            Watch Highlights
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const MultipleItemsPerSlide: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Training Drills</CardTitle>
            <CardDescription>3 items per slide</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {Array.from({ length: 12 }).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <div className="text-center space-y-2">
                            <div className="text-2xl font-bold">Drill {index + 1}</div>
                            <p className="text-sm text-muted-foreground">
                              Practice exercise
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const WithAutoplay: Story = {
  render: () => {
    const announcements = [
      { title: 'Match Day', message: 'Home game this Saturday at 3 PM' },
      { title: 'Training Camp', message: 'Summer camp registration now open' },
      { title: 'New Signings', message: 'Welcome our three new players!' },
      { title: 'Ticket Sales', message: 'Season passes available now' },
    ];

    return (
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Team Announcements</CardTitle>
            <CardDescription>Auto-plays every 3 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {announcements.map((announcement, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-primary/5">
                      <CardContent className="flex flex-col items-center justify-center p-8 space-y-2">
                        <h3 className="text-xl font-bold">{announcement.title}</h3>
                        <p className="text-center text-muted-foreground">
                          {announcement.message}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const WithProgressIndicator: Story = {
  render: () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!api) return;

      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on('select', () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }, [api]);

    const testimonials = [
      {
        quote: 'Best training program I\'ve been part of!',
        author: 'John Smith',
        role: 'Player',
      },
      {
        quote: 'Great coaching staff and excellent facilities.',
        author: 'Sarah Johnson',
        role: 'Parent',
      },
      {
        quote: 'My skills improved dramatically in just one season.',
        author: 'Mike Chen',
        role: 'Player',
      },
      {
        quote: 'Professional environment with a family atmosphere.',
        author: 'Emma Davis',
        role: 'Coach',
      },
    ];

    return (
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>What People Say</CardTitle>
            <CardDescription>Testimonials from our community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2">
                      <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-lg text-center italic">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className="text-center">
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex items-center justify-center gap-2">
              <div className="text-sm text-muted-foreground">
                {current} of {count}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: count }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === current - 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const VerticalOrientation: Story = {
  render: () => {
    const stats = [
      { label: 'Wins', value: 24 },
      { label: 'Draws', value: 8 },
      { label: 'Losses', value: 6 },
      { label: 'Goals', value: 72 },
      { label: 'Clean Sheets', value: 15 },
    ];

    return (
      <div className="w-full max-w-xs">
        <Card>
          <CardHeader>
            <CardTitle>Season Stats</CardTitle>
            <CardDescription>Scroll vertically</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel
              orientation="vertical"
              className="w-full max-w-xs"
              opts={{
                align: 'start',
              }}
            >
              <CarouselContent className="-mt-1 h-[300px]">
                {stats.map((stat, index) => (
                  <CarouselItem key={index} className="pt-1">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex items-center justify-between p-6">
                          <span className="font-semibold">{stat.label}</span>
                          <span className="text-3xl font-bold text-primary">
                            {stat.value}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const ImageGallery: Story = {
  render: () => {
    const images = [
      { title: 'Stadium View', color: 'bg-blue-500' },
      { title: 'Team Photo', color: 'bg-green-500' },
      { title: 'Training Ground', color: 'bg-purple-500' },
      { title: 'Locker Room', color: 'bg-orange-500' },
      { title: 'Trophy Cabinet', color: 'bg-red-500' },
    ];

    return (
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
            <CardDescription>View our facilities and moments</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="p-0">
                          <div
                            className={`aspect-video flex items-center justify-center ${image.color}`}
                          >
                            <span className="text-white text-2xl font-bold">
                              {image.title}
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground">
                              Photo {index + 1} of {images.length}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    );
  },
};
