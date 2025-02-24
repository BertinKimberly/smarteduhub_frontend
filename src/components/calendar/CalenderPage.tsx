
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '@/components/ui/full-calendar';
import { addHours } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  return (
    <Calendar
      events={[
        {
          id: '1',
          start: new Date(),
          end: addHours(new Date(), 2),
          title: 'event A',
          color: 'pink',
        },
        {
          id: '2',
          start: addHours(new Date(), 1.5),
          end: addHours(new Date(), 3),
          title: 'event B',
          color: 'blue',
        },
      ]}
    >
      <div className="h-dvh py-14 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          <CalendarViewTrigger
            className="aria-[current=true]:bg-[#D4E8F6]"
            view="day"
          >
            Day
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="week"
            className="aria-[current=true]:bg-[#D4E8F6]"
          >
            Week
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="month"
            className="aria-[current=true]:bg-[#D4E8F6]"
          >
            Month
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="year"
            className="aria-[current=true]:bg-[#D4E8F6]"
          >
            Year
          </CalendarViewTrigger>

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Previous</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Today</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Next</span>
          </CalendarNextTrigger>
        </div>

        <div className="flex-1 px-6 overflow-hidden">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
  );
}
