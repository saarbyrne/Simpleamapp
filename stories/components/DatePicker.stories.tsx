'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-[280px]">
        <DatePicker date={date} onSelect={setDate} placeholder="Select a date" />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="w-[280px]">
        <DatePicker date={date} onSelect={setDate} placeholder="Pick a date" />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Match Date</CardTitle>
          <CardDescription>Select the date for the upcoming match</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="match-date">Date</Label>
            <DatePicker
              date={date}
              onSelect={setDate}
              placeholder="Select match date"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const InForm: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Tournament Schedule</CardTitle>
          <CardDescription>Set the tournament start and end dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Select start date"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Select end date"
                className="w-full"
                disabled={!startDate}
              />
            </div>
            {startDate && endDate && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">Duration:</p>
                <p className="text-muted-foreground">
                  {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-[280px]">
        <DatePicker
          date={date}
          onSelect={setDate}
          placeholder="Disabled date picker"
          disabled
        />
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Player Birthday</CardTitle>
          <CardDescription>Enter the player's date of birth</CardDescription>
        </CardHeader>
        <CardContent>
          <DatePicker
            date={date}
            onSelect={setDate}
            placeholder="When were you born?"
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  },
};

export const MultipleFields: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [joinDate, setJoinDate] = useState<Date | undefined>(undefined);
    const [contractEnd, setContractEnd] = useState<Date | undefined>(undefined);

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Player Profile</CardTitle>
          <CardDescription>Important player dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <DatePicker
                date={birthDate}
                onSelect={setBirthDate}
                placeholder="Select birth date"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <DatePicker
                date={joinDate}
                onSelect={setJoinDate}
                placeholder="Select join date"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Contract End Date</Label>
              <DatePicker
                date={contractEnd}
                onSelect={setContractEnd}
                placeholder="Select contract end date"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
};
