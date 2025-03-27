import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEmojiReactions } from '@/hooks/use-emoji-reactions';
import { EmojiReactionWithUsers } from '@shared/schema';

interface EmojiReactionsProps {
  ticketId: number;
  currentUser: string;
  className?: string;
}

// Common emoji set for reactions
const COMMON_EMOJIS = [
  '👍', '👎', '❤️', '🔥', '👀', '🎉', '🙌', '👏',
  '⚡', '💡', '🔧', '🛠️', '⚠️', '❓', '✅', '⚙️'
];

export function EmojiReactions({ ticketId, currentUser, className = '' }: EmojiReactionsProps) {
  const { t } = useTranslation();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const { reactions, loading, addReaction, removeReaction } = useEmojiReactions(ticketId);

  // Handle adding a new reaction
  const handleAddReaction = async (emoji: string) => {
    setIsEmojiPickerOpen(false);
    try {
      await addReaction({
        ticketId,
        emoji,
        createdBy: currentUser
      });
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // Handle removing a reaction
  const handleRemoveReaction = async (reaction: EmojiReactionWithUsers) => {
    try {
      await removeReaction({
        ticketId,
        reactionId: reaction.id,
        username: currentUser
      });
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  };

  // Check if user has already reacted with this emoji
  const hasUserReacted = (reaction: EmojiReactionWithUsers) => {
    return reaction.users.includes(currentUser);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Existing reactions */}
      {reactions.map((reaction) => (
        <TooltipProvider key={reaction.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={hasUserReacted(reaction) ? "secondary" : "outline"}
                size="sm"
                className={`h-8 px-2 transition-all ${hasUserReacted(reaction) ? 'bg-secondary-300/40' : ''}`}
                onClick={() => hasUserReacted(reaction) ? handleRemoveReaction(reaction) : handleAddReaction(reaction.emoji)}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="text-xs font-medium">{reaction.count}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {reaction.users.join(', ')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {/* Add reaction button and emoji picker */}
      <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            disabled={loading}
          >
            <span className="mr-1">+</span>
            <span className="text-xs">{t('add_reaction')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="grid grid-cols-8 gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAddReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}