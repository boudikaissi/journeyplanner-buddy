import { useState } from "react";
import { Plus, Check, X, Edit, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TripChecklist as TripChecklistType, ChecklistItem } from "@/types/trip";

interface TripChecklistProps {
  tripId: string;
}

const TripChecklist = ({ tripId }: TripChecklistProps) => {
  const [checklists] = useState<TripChecklistType[]>([
    {
      id: "checklist-1",
      tripId,
      title: "Pre-Trip Preparation",
      createdBy: "user1",
      createdAt: "2024-07-01T00:00:00Z",
      items: [
        {
          id: "item-1",
          text: "Book flights",
          completed: true,
          assignedTo: "user1",
          completedBy: "user1",
          completedAt: "2024-07-05T10:30:00Z"
        },
        {
          id: "item-2", 
          text: "Get travel insurance",
          completed: true,
          assignedTo: "user2",
          completedBy: "user2",
          completedAt: "2024-07-06T14:15:00Z"
        },
        {
          id: "item-3",
          text: "Check passport expiry",
          completed: false,
          assignedTo: "user1",
          dueDate: "2024-08-01"
        },
        {
          id: "item-4",
          text: "Research local customs",
          completed: false,
          assignedTo: "user2"
        }
      ]
    },
    {
      id: "checklist-2",
      tripId,
      title: "Packing List",
      createdBy: "user2", 
      createdAt: "2024-07-10T00:00:00Z",
      items: [
        {
          id: "item-5",
          text: "Sunscreen and hat",
          completed: true,
          assignedTo: "user1",
          completedBy: "user1",
          completedAt: "2024-07-20T09:00:00Z"
        },
        {
          id: "item-6",
          text: "Swimming gear",
          completed: false,
          assignedTo: "user2"
        },
        {
          id: "item-7",
          text: "Comfortable walking shoes",
          completed: false,
          assignedTo: "user1"
        },
        {
          id: "item-8",
          text: "Camera and chargers",
          completed: false,
          assignedTo: "user2",
          dueDate: "2024-08-10"
        }
      ]
    }
  ]);

  const users = {
    "user1": { name: "Alex Chen", avatar: "/api/placeholder/32/32" },
    "user2": { name: "Sarah Miller", avatar: "/api/placeholder/32/32" }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleItemCompletion = (checklistId: string, itemId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle item ${itemId} in checklist ${checklistId}`);
  };

  const getTotalItems = () => {
    return checklists.reduce((total, checklist) => total + checklist.items.length, 0);
  };

  const getCompletedItems = () => {
    return checklists.reduce((total, checklist) => 
      total + checklist.items.filter(item => item.completed).length, 0
    );
  };

  const getOverdueItems = () => {
    const today = new Date();
    return checklists.reduce((total, checklist) => 
      total + checklist.items.filter(item => 
        !item.completed && item.dueDate && new Date(item.dueDate) < today
      ).length, 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Checklist</h3>
          <p className="text-sm text-muted-foreground">
            Stay organized with shared task lists
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {getTotalItems()}
            </div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {getCompletedItems()}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {getTotalItems() - getCompletedItems()}
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {getOverdueItems()}
            </div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {checklists.map((checklist) => {
          const completedCount = checklist.items.filter(item => item.completed).length;
          const totalCount = checklist.items.length;
          const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <Card key={checklist.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{checklist.title}</CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {completedCount}/{totalCount} completed
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {checklist.items.map((item) => {
                  const isOverdue = !item.completed && item.dueDate && new Date(item.dueDate) < new Date();
                  
                  return (
                    <div 
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        item.completed 
                          ? 'bg-green-50 border-green-200 opacity-75' 
                          : 'bg-background border-border hover:shadow-sm'
                      }`}
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItemCompletion(checklist.id, item.id)}
                        className="flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item.text}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          {item.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>Assigned to {users[item.assignedTo]?.name}</span>
                            </div>
                          )}
                          
                          {item.dueDate && (
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
                              <Calendar className="w-3 h-3" />
                              <span>Due {formatDate(item.dueDate)}</span>
                              {isOverdue && <Badge variant="destructive" className="ml-1 text-xs">Overdue</Badge>}
                            </div>
                          )}
                          
                          {item.completedBy && item.completedAt && (
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Completed by {users[item.completedBy]?.name} on {formatDate(item.completedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {item.assignedTo && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={users[item.assignedTo]?.avatar} />
                            <AvatarFallback className="text-xs">
                              {users[item.assignedTo]?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TripChecklist;