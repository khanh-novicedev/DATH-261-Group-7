import { useState, useMemo } from 'react';
import { ReportFilterState, ReportItem} from '../types';
import { Metric } from '../../shared/types/Metric';
import { initialReports } from '../api/mockData';

export const useReportManagement = () => {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);

  const [filters, setFilters] = useState<ReportFilterState>({
    search: '',
    status: 'Pending',
    flag: 'All',
    startDate: new Date(0),
    endDate: new Date(),
    // reportedPage: 'All',
  });

  const handleFilterChange = (newFilters: Partial<ReportFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search
      const matchesSearch =
        filters.search.trim() === '' ||
        report.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.reportedContent.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.reportedPage.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.reason.toLowerCase().includes(filters.search.toLowerCase());

      // Status
      const matchesStatus =
      filters.status === 'All' ||report.status === filters.status;

      // Date filter
      const matchesDate = 
        filters.startDate < report.date && report.date < filters.endDate;

      // Flag filter
      const matchesFlag = 
        filters.flag === 'All' || report.flag === filters.flag;

      return matchesSearch && matchesStatus && matchesDate && matchesFlag;
    });
  }, [reports, filters]);

  const handleDismissReport = (id : number) => {
    setReports(reports.map(report => report.id === id ? {...report, status: 'Dismissed'} : report));
    console.log(reports);
  }
  const handleResolveReport = (id: number) => {
    setReports(reports.map(report => report.id === id ? {...report, status: 'Resolved'} : report));
    console.log(reports);
  }
  // Compute metrics current reports
  const metrics: Metric[] = useMemo(() => {
    const metricTitles = ['Total Reports', "Pending Reports", "Resolved Reports"];
    const res : Metric[] = [];
    metricTitles.forEach(title => {
      res.push({
        title,
        value: 0,
      });
    })
    if (reports.length === 0) {
      return res;
    }
    
    const metricValues = [reports.length, 0, 0];
    reports.forEach(report => {
      if(report.status === 'Pending') metricValues[1]++;
      else if(report.status === 'Resolved') metricValues[2]++;
    })
    res.forEach((val, index) => {
      val.value = metricValues[index];
    })
    return res;   
  }, [reports]);

  return {
    filteredReports,
    metrics,
    filters,
    handleFilterChange,
    handleDismissReport,
    handleResolveReport,
  };
};
