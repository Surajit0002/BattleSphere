
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import RootLayout from "@/layouts/RootLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: tournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getTournamentsByDate = (date: Date) => {
    return tournaments?.filter(tournament => {
      const tournamentDate = new Date(tournament.startDate);
      return format(tournamentDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });
  };

  return (
    <RootLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tournament Calendar</h1>
          <p className="text-muted-foreground">
            View and track upcoming tournaments
          </p>
        </div>

        <Card className="bg-secondary-bg/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, i) => {
                const dayTournaments = getTournamentsByDate(date);
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] p-2 border border-gray-800 rounded-lg ${
                      format(date, "MM") !== format(currentDate, "MM")
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">
                      {format(date, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayTournaments?.map((tournament) => (
                        <Badge
                          key={tournament.id}
                          variant="outline"
                          className="block text-xs truncate cursor-pointer hover:bg-primary/20"
                        >
                          {tournament.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}
