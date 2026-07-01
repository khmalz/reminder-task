import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function HistoryTable({ paginatedHistory = [] }) {
   return (
      <div className="border-border/40 shadow-3xs w-full overflow-hidden rounded-xl border bg-white/40">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Tugas Terkait</TableHead>
                  <TableHead>Sesi</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Waktu Selesai</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {paginatedHistory.length > 0 ? (
                  paginatedHistory.map(session => (
                     <TableRow key={session.id}>
                        <TableCell className="max-w-[200px] truncate" title={session.taskName}>
                           {session.taskName}
                        </TableCell>
                        <TableCell>
                           <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${session.mode.includes("Fokus") ? "bg-accent/40 border-accent/80 text-primary" : "bg-background/60 border-border/60 text-primary/80"}`}>
                              {session.mode}
                           </span>
                        </TableCell>
                        <TableCell>{session.duration} menit</TableCell>
                        <TableCell className="text-secondary/80 text-xs font-medium">{session.timestamp}</TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={4} className="text-secondary/60 py-16 text-center text-xs font-semibold">
                        Belum ada sesi Pomodoro yang tercatat hari ini
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
   );
}
