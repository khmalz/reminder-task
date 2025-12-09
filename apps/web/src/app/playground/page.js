import { ProfileNavbar } from "@/components/dashboard/profilenavbar";
import EditProfileDialog from "@/components/dialog/editprofiledialog";
import CalendarWidget from "@/components/widget/calendarwidget";
import CounterTaskWidget from "@/components/widget/countertaskwidget";
import TaskCard from "@/components/card/taskcard";
export default function Playground() {
   return (
      <div className="bg-background flex min-h-screen items-center justify-center">
         <TaskCard task={""}></TaskCard>
      </div>
   );
}
