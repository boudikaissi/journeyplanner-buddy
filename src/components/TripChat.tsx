import { useState } from "react";
import { Send, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TripMessage } from "@/types/trip";

interface TripChatProps {
  tripId: string;
}

const TripChat = ({ tripId }: TripChatProps) => {
  const [messages] = useState<TripMessage[]>([
    {
      id: "msg-1",
      tripId,
      senderId: "user1",
      content: "Hey everyone! Super excited about this trip! 🎉",
      type: "text",
      timestamp: "2024-07-15T10:30:00Z"
    },
    {
      id: "msg-2",
      tripId,
      senderId: "user2",
      content: "Me too! I found a great restaurant we should try in Ubud.",
      type: "text",
      timestamp: "2024-07-15T10:32:00Z"
    },
    {
      id: "msg-3",
      tripId,
      senderId: "user1",
      content: "Perfect! Did you see the temple tour I added to the ideas board?",
      type: "text",
      timestamp: "2024-07-15T10:35:00Z"
    },
    {
      id: "msg-4",
      tripId,
      senderId: "user2",
      content: "Yes! Already moved it to the 'Booked' column. Can't wait!",
      type: "text",
      timestamp: "2024-07-15T11:00:00Z"
    },
    {
      id: "msg-5",
      tripId,
      senderId: "user1",
      content: "Should we split the cost for the private driver? It's about $50/day.",
      type: "text",
      timestamp: "2024-07-16T09:15:00Z"
    },
    {
      id: "msg-6",
      tripId,
      senderId: "user2",
      content: "Sounds good to me! I'll add it to the expenses.",
      type: "text",
      timestamp: "2024-07-16T09:18:00Z"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const users = {
    "user1": { 
      name: "Alex Chen", 
      avatar: "/api/placeholder/32/32",
      color: "bg-blue-100 text-blue-800"
    },
    "user2": { 
      name: "Sarah Miller", 
      avatar: "/api/placeholder/32/32",
      color: "bg-purple-100 text-purple-800"
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send to backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by user and proximity in time
  const groupedMessages = messages.reduce((groups: any[], message, index) => {
    const previousMessage = messages[index - 1];
    const shouldGroup = previousMessage &&
      previousMessage.senderId === message.senderId &&
      new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() < 5 * 60 * 1000; // 5 minutes

    if (shouldGroup) {
      groups[groups.length - 1].messages.push(message);
    } else {
      groups.push({
        senderId: message.senderId,
        user: users[message.senderId as keyof typeof users],
        timestamp: message.timestamp,
        messages: [message]
      });
    }
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Group Chat
          </h3>
          <p className="text-sm text-muted-foreground">
            Stay connected with your travel group
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trip Discussion</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {groupedMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={group.user?.avatar} />
                    <AvatarFallback className={group.user?.color}>
                      {group.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    {/* User name and timestamp for first message in group */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {group.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(group.timestamp)}
                      </span>
                    </div>
                    
                    {/* Messages */}
                    <div className="space-y-1">
                      {group.messages.map((message: TripMessage) => (
                        <div 
                          key={message.id}
                          className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 inline-block"
                        >
                          {message.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-foreground">
              {messages.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Messages</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-foreground">
              {Object.keys(users).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-foreground">
              {messages.filter(msg => {
                const msgDate = new Date(msg.timestamp);
                const today = new Date();
                return msgDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-foreground">
              {messages.filter(msg => {
                const msgDate = new Date(msg.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return msgDate > weekAgo;
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripChat;