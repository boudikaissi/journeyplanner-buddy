import { useState } from "react";
import { Plus, Edit, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TripParticipant } from "@/types/trip";

interface ParticipantDetails extends TripParticipant {
  arrivalDate?: string;
  departureDate?: string;
  accommodation?: string;
  phone?: string;
}

interface TripParticipantsProps {
  tripId: string;
  participants: TripParticipant[];
}

const TripParticipants = ({ tripId, participants }: TripParticipantsProps) => {
  const [participantDetails] = useState<ParticipantDetails[]>([
    {
      ...participants[0],
      arrivalDate: "2024-08-15",
      departureDate: "2024-08-22",
      accommodation: "Ubud Resort - Deluxe Room",
      phone: "+1 (555) 123-4567"
    },
    {
      ...participants[1],
      arrivalDate: "2024-08-16",
      departureDate: "2024-08-21",
      accommodation: "Ubud Resort - Standard Room",
      phone: "+1 (555) 987-6543"
    }
  ]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-primary/10 text-primary border-primary/20";
      case "editor": return "bg-accent/10 text-accent-foreground border-accent/20";
      case "viewer": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Participants</h3>
          <p className="text-sm text-muted-foreground">
            Manage who's joining your trip and their details
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite Participant
        </Button>
      </div>

      {/* Participants Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Accommodation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantDetails.map((participant) => (
                <TableRow key={participant.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.user?.avatar} />
                        <AvatarFallback>
                          {participant.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.user?.name}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{participant.user?.email}</span>
                          </div>
                          {participant.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{participant.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getRoleColor(participant.role)} border capitalize`}
                    >
                      {participant.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(participant.status)} border capitalize`}
                    >
                      {participant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{formatDate(participant.arrivalDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>{formatDate(participant.departureDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate max-w-[150px]" title={participant.accommodation}>
                        {participant.accommodation || "Not assigned"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {participantDetails.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {participantDetails.filter(p => p.status === "accepted").length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {participantDetails.filter(p => p.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {participantDetails.filter(p => p.accommodation).length}
            </div>
            <p className="text-sm text-muted-foreground">Accommodated</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripParticipants;