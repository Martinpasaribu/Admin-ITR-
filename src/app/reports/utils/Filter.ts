// utils/Filter.ts
import { Report, Customer, Room } from "../models";

export interface ReportFilters {
  report_type?: string;
  broken_type?: string;
  progress?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string; // 🔹 Ganti customer_name dan room_code dengan searchTerm
}
export function filterReports(reports: Report[], filters: ReportFilters): Report[] {
  return reports.filter((report) => {
    const normalizedSearchTerm = filters.searchTerm?.toLowerCase() || "";

    const reportCode = (report.report_code ?? "").toString().toLowerCase();
    const reportTypeMatch = !filters.report_type || report.report_type === filters.report_type;
    const brokenTypeMatch = !filters.broken_type || report.broken_type === filters.broken_type;
    const progressMatch = !filters.progress || report.progress === filters.progress;

    // 🔹 Logika filter gabungan
    const combinedSearchMatch = !normalizedSearchTerm || reportCode.includes(normalizedSearchTerm) ||
      (report.customer_key &&
        typeof report.customer_key !== 'string' &&
        (
          // Mencari di username
          (report.customer_key as Customer).username.toLowerCase().includes(normalizedSearchTerm) ||
          // Mencari di kode kamar
          ((report.customer_key as Customer).room_key &&
            typeof (report.customer_key as Customer).room_key !== 'string' &&
            ((report.customer_key as Customer).room_key as Room).code.toLowerCase().includes(normalizedSearchTerm)
          )
        )
      );


    // 🔹 Filter berdasarkan tanggal
    let dateMatch = true;
    if (filters.startDate || filters.endDate) {
      if (report.createdAt) {
        const reportDate = new Date(report.createdAt);
        
        const startDateMatch = !filters.startDate || reportDate >= filters.startDate;
        const endDateMatch = !filters.endDate || reportDate <= filters.endDate;
        
        dateMatch = startDateMatch && endDateMatch;
      } else {
        dateMatch = false;
      }
    }
    
    return reportTypeMatch && brokenTypeMatch && progressMatch && combinedSearchMatch && dateMatch;
  });
}