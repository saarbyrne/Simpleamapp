import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users, Calendar, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    badges: ['stable'],
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            Team Details
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 text-sm">
          Eagles FC - Premier Division
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 text-sm">
            Manager: John Doe
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            Stadium: Eagle Arena
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            Founded: 1995
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const PlayerStats: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px] border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              JS
            </div>
            <div>
              <h4 className="font-semibold">John Smith</h4>
              <p className="text-sm text-muted-foreground">Forward • #23</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? 'Hide' : 'Show'} Stats
              {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4 mt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Assists</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Rating</span>
              <span className="font-medium">8.5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minutes Played</span>
              <span className="font-medium">2,160</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shots on Target</span>
              <span className="font-medium">45</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const GameSchedule: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[450px] border rounded-lg">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h4 className="font-semibold">Upcoming Games</h4>
            <Badge variant="secondary">{isOpen ? '3' : ''}</Badge>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t">
            <div className="p-4 border-b hover:bg-accent transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Eagles FC vs Thunder United</p>
                  <p className="text-sm text-muted-foreground">January 20, 2026 • 7:00 PM</p>
                </div>
                <Badge variant="outline">Home</Badge>
              </div>
            </div>
            <div className="p-4 border-b hover:bg-accent transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Storm Athletic vs Eagles FC</p>
                  <p className="text-sm text-muted-foreground">January 25, 2026 • 3:00 PM</p>
                </div>
                <Badge variant="outline">Away</Badge>
              </div>
            </div>
            <div className="p-4 hover:bg-accent transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Eagles FC vs Lightning FC</p>
                  <p className="text-sm text-muted-foreground">February 1, 2026 • 6:00 PM</p>
                </div>
                <Badge variant="outline">Home</Badge>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const TeamRoster: Story = {
  render: () => {
    const [forwards, setForwards] = useState(true);
    const [midfielders, setMidfielders] = useState(false);
    const [defenders, setDefenders] = useState(false);

    return (
      <div className="w-[400px] space-y-2">
        <h3 className="font-semibold mb-4">Team Roster by Position</h3>

        <Collapsible open={forwards} onOpenChange={setForwards} className="border rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Forwards</span>
              <Badge variant="secondary">3</Badge>
            </div>
            {forwards ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">John Smith</span>
                  <Badge variant="outline">#23</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tom Davis</span>
                  <Badge variant="outline">#9</Badge>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alex Brown</span>
                  <Badge variant="outline">#11</Badge>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={midfielders} onOpenChange={setMidfielders} className="border rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Midfielders</span>
              <Badge variant="secondary">4</Badge>
            </div>
            {midfielders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sarah Williams</span>
                  <Badge variant="outline">#10</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emma Taylor</span>
                  <Badge variant="outline">#8</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">James Wilson</span>
                  <Badge variant="outline">#6</Badge>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Chris Martin</span>
                  <Badge variant="outline">#7</Badge>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={defenders} onOpenChange={setDefenders} className="border rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Defenders</span>
              <Badge variant="secondary">5</Badge>
            </div>
            {defenders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">David Lee</span>
                  <Badge variant="outline">#5</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Robert Chen</span>
                  <Badge variant="outline">#4</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lisa Anderson</span>
                  <Badge variant="outline">#3</Badge>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kevin Zhang</span>
                  <Badge variant="outline">#2</Badge>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mike Johnson (GK)</span>
                  <Badge variant="outline">#1</Badge>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

export const SeasonStats: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[450px] border rounded-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <h4 className="font-semibold">Season 2025-2026</h4>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                {isOpen ? 'Show Less' : 'Show More'}
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground">Games</p>
            </div>
            <div>
              <p className="text-2xl font-bold">75%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold">68</p>
              <p className="text-xs text-muted-foreground">Goals</p>
            </div>
          </div>
        </div>
        <CollapsibleContent>
          <div className="border-t p-4 space-y-4">
            <div>
              <h5 className="font-medium mb-2">Detailed Statistics</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Wins</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Draws</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Losses</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goals Against</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Clean Sheets</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Possession</span>
                  <span className="font-medium">56%</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Top Performers</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Top Scorer</span>
                  <span className="font-medium">John Smith (15)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Most Assists</span>
                  <span className="font-medium">Sarah Williams (10)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best Rating</span>
                  <span className="font-medium">John Smith (8.5)</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const FAQ: Story = {
  render: () => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const faqs = [
      {
        id: '1',
        question: 'How do I add a new player to the roster?',
        answer: 'Navigate to the Players page and click the "Add Player" button. Fill in the required information including name, position, and jersey number, then click Save.',
      },
      {
        id: '2',
        question: 'Can I schedule games for multiple teams?',
        answer: 'Yes, you can manage multiple teams. Simply switch between teams using the team selector in the navigation bar, and each team will have its own schedule.',
      },
      {
        id: '3',
        question: 'How are player statistics calculated?',
        answer: 'Player statistics are automatically calculated based on game data. This includes goals, assists, minutes played, and performance ratings which are updated after each game.',
      },
    ];

    return (
      <div className="w-[500px] space-y-2">
        <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItem === faq.id}
            onOpenChange={(open) => setOpenItem(open ? faq.id : null)}
            className="border rounded-lg"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-accent transition-colors text-left">
              <span className="font-medium">{faq.question}</span>
              {openItem === faq.id ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4">
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
};
