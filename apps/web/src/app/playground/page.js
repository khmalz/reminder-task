import { ProfileNavbar } from "@/components/dashboard/profilenavbar";
import  EditProfileDialog  from "@/components/dialog/editprofiledialog";
import CalendarWidget from "@/components/widget/calendarwidget";
export default function Playground() {
   return (
      <div className="bg-background flex min-h-screen items-center justify-center">
         <CalendarWidget />
      </div>
   );
}
