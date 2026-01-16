'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimePicker } from '@/components/ui/time-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'padded',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => {
    const [time, setTime] = useState<string>('');

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label>Select Time</Label>
          <TimePicker
            time={time}
            onSelect={(timeString) => setTime(timeString)}
            placeholder="Pick a time"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Selected time: {time || 'None'}
        </p>
      </div>
    );
  },
};

export const ScheduleMatch: Story = {
  render: () => {
    const [kickoffTime, setKickoffTime] = useState<string>('19:00');

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Schedule Match</CardTitle>
          <CardDescription>Set the kickoff time for the match</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kickoff">Kickoff Time</Label>
            <TimePicker
              time={kickoffTime}
              onSelect={(timeString) => setKickoffTime(timeString)}
              placeholder="Select kickoff time"
            />
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">Match Details</p>
            <p className="text-sm text-muted-foreground">
              The match will start at {kickoffTime || 'TBD'}
            </p>
          </div>
          <Button className="w-full">Confirm Schedule</Button>
        </CardContent>
      </Card>
    );
  },
};

export const TrainingSession: Story = {
  render: () => {
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('11:00');

    const calculateDuration = () => {
      if (!startTime || !endTime) return 'N/A';
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return `${hours}h ${minutes}m`;
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Training Session</CardTitle>
          <CardDescription>Schedule a practice session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <TimePicker
              time={startTime}
              onSelect={(timeString) => setStartTime(timeString)}
              placeholder="Select start time"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <TimePicker
              time={endTime}
              onSelect={(timeString) => setEndTime(timeString)}
              placeholder="Select end time"
            />
          </div>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <span className="text-sm text-muted-foreground">
                {calculateDuration()}
              </span>
            </div>
          </div>
          <Button className="w-full">Schedule Training</Button>
        </CardContent>
      </Card>
    );
  },
};

export const MeetingReminder: Story = {
  render: () => {
    const [meetingTime, setMeetingTime] = useState<string>('14:30');

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team Meeting</CardTitle>
          <CardDescription>Set a reminder for the team meeting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-time">Meeting Time</Label>
            <TimePicker
              time={meetingTime}
              onSelect={(timeString) => setMeetingTime(timeString)}
              placeholder="Select meeting time"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Reminder will be sent:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 1 hour before ({meetingTime && calculateReminderTime(meetingTime, -60)})</li>
              <li>• 15 minutes before ({meetingTime && calculateReminderTime(meetingTime, -15)})</li>
            </ul>
          </div>
          <Button className="w-full">Set Reminder</Button>
        </CardContent>
      </Card>
    );
  },
};

export const WithPresetTimes: Story = {
  render: () => {
    const [time, setTime] = useState<string>('');
    const presetTimes = [
      { label: 'Morning (9:00 AM)', value: '09:00' },
      { label: 'Afternoon (2:00 PM)', value: '14:00' },
      { label: 'Evening (6:00 PM)', value: '18:00' },
      { label: 'Night (9:00 PM)', value: '21:00' },
    ];

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quick Time Selection</CardTitle>
          <CardDescription>Use presets or pick custom time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preset Times</Label>
            <div className="grid grid-cols-2 gap-2">
              {presetTimes.map((preset) => (
                <Button
                  key={preset.value}
                  variant={time === preset.value ? 'default' : 'outline'}
                  onClick={() => setTime(preset.value)}
                  className="w-full"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Custom Time</Label>
            <TimePicker
              time={time}
              onSelect={(timeString) => setTime(timeString)}
              placeholder="Pick a custom time"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Selected: {time || 'None'}
          </p>
        </CardContent>
      </Card>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label>Disabled Time Picker</Label>
          <TimePicker
            time="15:30"
            onSelect={() => {}}
            placeholder="Disabled"
            disabled
          />
        </div>
        <p className="text-sm text-muted-foreground">
          This time picker is disabled and cannot be edited
        </p>
      </div>
    );
  },
};

export const MultipleTimePickers: Story = {
  render: () => {
    const [morningTime, setMorningTime] = useState<string>('08:00');
    const [afternoonTime, setAfternoonTime] = useState<string>('14:00');
    const [eveningTime, setEveningTime] = useState<string>('19:00');

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daily Schedule</CardTitle>
          <CardDescription>Set times for different parts of the day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="morning">Morning Session</Label>
            <TimePicker
              time={morningTime}
              onSelect={(timeString) => setMorningTime(timeString)}
              placeholder="Morning time"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="afternoon">Afternoon Session</Label>
            <TimePicker
              time={afternoonTime}
              onSelect={(timeString) => setAfternoonTime(timeString)}
              placeholder="Afternoon time"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evening">Evening Session</Label>
            <TimePicker
              time={eveningTime}
              onSelect={(timeString) => setEveningTime(timeString)}
              placeholder="Evening time"
            />
          </div>
          <div className="rounded-md border p-4 space-y-2">
            <p className="text-sm font-medium">Daily Schedule Summary</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Morning: {morningTime}</li>
              <li>Afternoon: {afternoonTime}</li>
              <li>Evening: {eveningTime}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const WithFormValidation: Story = {
  render: () => {
    const [time, setTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = () => {
      if (!time) {
        setError('Please select a time');
        return;
      }
      const [hour] = time.split(':').map(Number);
      if (hour < 8 || hour >= 22) {
        setError('Time must be between 08:00 and 22:00');
        return;
      }
      setError('');
      alert(`Time selected: ${time}`);
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Booking Form</CardTitle>
          <CardDescription>Select a time (8:00 AM - 10:00 PM only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-time">Preferred Time</Label>
            <TimePicker
              time={time}
              onSelect={(timeString) => {
                setTime(timeString);
                setError('');
              }}
              placeholder="Select your preferred time"
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Submit Booking
          </Button>
        </CardContent>
      </Card>
    );
  },
};

// Helper function to calculate reminder times
function calculateReminderTime(timeString: string, minutesOffset: number): string {
  const [hour, minute] = timeString.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutesOffset;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
}
