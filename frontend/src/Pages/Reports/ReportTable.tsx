import React from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography 
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import { ReportData } from '../../../State/admin/adminReportSlice';
import { useNavigate } from 'react-router-dom';

interface ReportTableProps {
  reports: ReportData[];
}

const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  const navigate = useNavigate();

  const handleViewReport = (reportId: number | undefined) => {
    if (reportId) {
      navigate(`/admin/reports/${reportId}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getReportTypeLabel = (type: string) => {
    const reportTypes: Record<string, string> = {
      'sales': 'Sales Report',
      'inventory': 'Inventory Report',
      'customers': 'Customer Analytics',
      'revenue': 'Revenue Analysis',
      'products': 'Product Performance'
    };
    return reportTypes[type] || type;
  };

  if (reports.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body1" color="textSecondary">
          No reports have been generated yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Report Title</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Generated At</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.title}</TableCell>
              <TableCell>{getReportTypeLabel(report.type)}</TableCell>
              <TableCell>{formatDate(report.generatedAt)}</TableCell>
              <TableCell>
                <Chip 
                  label={report.status.charAt(0).toUpperCase() + report.status.slice(1)} 
                  color={getStatusColor(report.status) as 'success' | 'warning' | 'error' | 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewReport(report.id)}
                    disabled={report.status !== 'completed'}
                  >
                    View
                  </Button>
                  {report.downloadUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      href={report.downloadUrl}
                      disabled={report.status !== 'completed'}
                    >
                      Download
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
