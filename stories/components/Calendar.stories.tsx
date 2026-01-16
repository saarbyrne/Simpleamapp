'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
      from: new Date(2024, 0, 20),
      to: new Date(2024, 0, 27),
    });

    return (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Select Date Range</CardTitle>
          <CardDescription>Pick training camp dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
            numberOfMonths={2}
            className="rounded-md"
          />
          {dateRange?.from && (
            <div className="mt-4 text-sm text-muted-foreground">
              Selected: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([
      new Date(2024, 0, 15),
      new Date(2024, 0, 20),
      new Date(2024, 0, 25),
    ]);

    return (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Select Practice Days</CardTitle>
          <CardDescription>Choose multiple training dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={setDates}
            className="rounded-md"
          />
          {dates && dates.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Selected {dates.length} date{dates.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Schedule Match</CardTitle>
          <CardDescription>Select a date (weekends only, next 7 days disabled)</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            disabled={(date) => {
              const day = date.getDay();
              const isWeekday = day !== 0 && day !== 6;
              const isNextWeek = date >= today && date <= nextWeek;
              return isWeekday || isNextWeek;
            }}
          />
        </CardContent>
      </Card>
    );
  },
};

export const TwoMonths: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Season Planning</CardTitle>
          <CardDescription>View two months at once</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className="rounded-md"
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithDropdowns: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const currentYear = new Date().getFullYear();

    return (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Event Date</CardTitle>
          <CardDescription>Quick month and year selection</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            captionLayout="dropdown"
            fromYear={currentYear - 5}
            toYear={currentYear + 5}
          />
        </CardContent>
      </Card>
    );
  },
};

export const MinimalStyle: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showOutsideDays={false}
      />
    );
  },
};
