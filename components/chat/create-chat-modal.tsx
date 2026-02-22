'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Participant } from '@/types/chat';
import { createChat } from '@/lib/chat';
import { getChatParticipants } from '@/app/actions/chat';
import { toast } from 'sonner';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  orgId: string;
  onChatCreated: (chatId: string) => void;
}

export function CreateChatModal({
  isOpen,
  onClose,
  userId,
  userName,
  orgId,
  onChatCreated,
}: CreateChatModalProps) {
  const [chatType, setChatType] = useState<'group' | 'direct'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);

  // Fetch real participants from database
  useEffect(() => {
    if (!isOpen) return;

    async function fetchParticipants() {
      setLoadingParticipants(true);
      try {
        const result = await getChatParticipants();
        if (result.success && result.data) {
          setParticipants(result.data);
        } else {
          toast.error(result.error || 'Failed to load participants');
          setParticipants([]);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
        toast.error('Failed to load participants');
        setParticipants([]);
      } finally {
        setLoadingParticipants(false);
      }
    }

    fetchParticipants();
  }, [isOpen]);

  const availableParticipants = participants.filter((p) => {
    if (!searchQuery) return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleParticipantToggle = (participantId: string) => {
    if (chatType === 'direct') {
      setSelectedParticipants([participantId]);
    } else {
      setSelectedParticipants((prev) =>
        prev.includes(participantId)
          ? prev.filter((id) => id !== participantId)
          : [...prev, participantId]
      );
    }
  };

  const handleCreate = async () => {
    if (chatType === 'group' && !groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setCreating(true);

    try {
      const chatId = await createChat({
        orgId,
        type: chatType,
        name: chatType === 'group' ? groupName.trim() : undefined,
        participantIds: [...selectedParticipants, userId],
        createdBy: userId,
        creatorName: userName,
      });

      toast.success(
        chatType === 'direct' ? 'Chat created' : 'Group chat created'
      );

      // Reset form state
      setGroupName('');
      setSelectedParticipants([]);
      setSearchQuery('');
      setChatType('direct');
      setLoadingParticipants(true);

      // Close modal by calling onClose (which updates parent state)
      onClose();

      // Call the callback to notify parent (after modal is closed)
      onChatCreated(chatId);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat. Please check your permissions.');

      // Close modal even on error so user can retry or cancel
      onClose();
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedParticipants([]);
    setSearchQuery('');
    setChatType('direct');
    setLoadingParticipants(true);
    onClose();
  };

  const isValid =
    selectedParticipants.length > 0 &&
    (chatType === 'direct' || groupName.trim().length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Start a conversation with your team members
          </DialogDescription>
        </DialogHeader>

        <Tabs value={chatType} onValueChange={(v) => setChatType(v as 'group' | 'direct')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">Direct Message</TabsTrigger>
            <TabsTrigger value="group">Group Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="space-y-4">
            <div>
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={creating}
              />
            </div>
          </TabsContent>

          <TabsContent value="direct">
            {/* Content handled below in participant selection */}
          </TabsContent>
        </Tabs>

        {/* Participant Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              {chatType === 'direct' ? 'Select Person' : 'Select Participants'}
            </Label>
            {chatType === 'group' && selectedParticipants.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedParticipants.length} selected
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
            <Search className="h-4 w-4 text-muted-foreground me-2 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 px-0 h-10"
              disabled={creating}
            />
          </div>

          {/* Participant List */}
          <ScrollArea className="h-64 border rounded-md">
            {loadingParticipants ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-sm">Loading participants...</p>
                </div>
              </div>
            ) : availableParticipants.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No participants found' : 'No participants available'}
                </p>
              </div>
            ) : chatType === 'direct' ? (
              <RadioGroup
                value={selectedParticipants[0] || ''}
                onValueChange={(value) => setSelectedParticipants([value])}
                disabled={creating}
              >
                {availableParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3 p-3 hover:bg-accent"
                  >
                    <RadioGroupItem value={participant.id} id={participant.id} />
                    <Avatar className="h-10 w-10">
                      {participant.avatarUrl ? (
                        <Image
                          src={participant.avatarUrl}
                          alt={participant.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized={!participant.avatarUrl?.includes('supabase.co')}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor={participant.id} className="cursor-pointer">
                        {participant.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-1">
                {availableParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3 p-3 hover:bg-accent"
                  >
                    <Checkbox
                      id={participant.id}
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={() => handleParticipantToggle(participant.id)}
                      disabled={creating}
                    />
                    <Avatar className="h-10 w-10">
                      {participant.avatarUrl ? (
                        <Image
                          src={participant.avatarUrl}
                          alt={participant.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized={!participant.avatarUrl?.includes('supabase.co')}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor={participant.id} className="cursor-pointer">
                        {participant.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!isValid || creating}>
            {creating && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
