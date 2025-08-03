import { useState } from "react";
import { Plus, Link, Clock, MapPin, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TripIdea {
  id: string;
  title: string;
  description?: string;
  time?: string;
  link?: string;
  location?: string;
  category: "pending" | "booked" | "unsure" | "places";
  addedBy: string;
  createdAt: string;
}

interface TripIdeasProps {
  tripId: string;
}

const TripIdeas = ({ tripId }: TripIdeasProps) => {
  const [ideas] = useState<TripIdea[]>([
    {
      id: "1",
      title: "Sacred Monkey Forest Sanctuary",
      description: "Visit the famous monkey sanctuary in Ubud",
      time: "2-3 hours",
      link: "https://example.com/monkey-forest",
      location: "Ubud, Bali",
      category: "pending",
      addedBy: "Alex Chen",
      createdAt: "2024-07-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Sunset at Tanah Lot",
      description: "Watch sunset at the iconic temple",
      time: "Evening",
      location: "Tanah Lot, Bali",
      category: "booked",
      addedBy: "Sarah Miller",
      createdAt: "2024-07-16T14:30:00Z"
    },
    {
      id: "3",
      title: "Surfing Lessons",
      description: "Learn to surf in Canggu",
      time: "Half day",
      location: "Canggu Beach",
      category: "unsure",
      addedBy: "Alex Chen",
      createdAt: "2024-07-17T09:15:00Z"
    },
    {
      id: "4",
      title: "Warung Bebek Bengil",
      description: "Famous crispy duck restaurant",
      location: "Ubud",
      category: "places",
      addedBy: "Sarah Miller",
      createdAt: "2024-07-18T16:45:00Z"
    }
  ]);

  const categories = [
    { id: "pending", title: "Pending", color: "bg-yellow-100 border-yellow-200" },
    { id: "booked", title: "Booked", color: "bg-green-100 border-green-200" },
    { id: "unsure", title: "Unsure", color: "bg-orange-100 border-orange-200" },
    { id: "places", title: "Places", color: "bg-blue-100 border-blue-200" }
  ];

  const getIdeasByCategory = (category: string) => {
    return ideas.filter(idea => idea.category === category);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Ideas & Places</h3>
          <p className="text-sm text-muted-foreground">
            Organize your ideas with drag-and-drop between categories
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Idea
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categoryIdeas = getIdeasByCategory(category.id);
          
          return (
            <div key={category.id} className="space-y-4">
              {/* Column Header */}
              <div className={`p-3 rounded-lg border-2 border-dashed ${category.color}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{category.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {categoryIdeas.length}
                  </Badge>
                </div>
              </div>

              {/* Ideas Cards */}
              <div className="space-y-3 min-h-[400px]">
                {categoryIdeas.map((idea) => (
                  <Card 
                    key={idea.id} 
                    className="cursor-move hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4">
                      {/* Drag Handle */}
                      <div className="flex items-start gap-2 mb-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-grab" />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm line-clamp-2">{idea.title}</h5>
                        </div>
                      </div>

                      {/* Description */}
                      {idea.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {idea.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="space-y-2">
                        {idea.time && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{idea.time}</span>
                          </div>
                        )}
                        
                        {idea.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{idea.location}</span>
                          </div>
                        )}
                        
                        {idea.link && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Link className="w-3 h-3" />
                            <a 
                              href={idea.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary truncate"
                            >
                              View Link
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {idea.addedBy}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(idea.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Empty State */}
                {categoryIdeas.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-border/50 rounded-lg text-center text-muted-foreground">
                    <p className="text-sm">Drop ideas here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const count = getIdeasByCategory(category.id).length;
          return (
            <Card key={category.id}>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-foreground">{count}</div>
                <p className="text-sm text-muted-foreground">{category.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TripIdeas;