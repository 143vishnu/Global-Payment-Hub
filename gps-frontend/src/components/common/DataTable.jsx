import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
} from '@mui/material';

const DataTable = ({
  columns,
  data,
  page = 0,
  rowsPerPage = 20,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  orderBy,
  order = 'asc',
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  const handleSort = (column) => {
    if (column.sortable !== false && onSort) {
      const isAsc = orderBy === column.id && order === 'asc';
      onSort(column.id, isAsc ? 'desc' : 'asc');
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    bgcolor: 'background.default',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                  }}
                >
                  {column.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ 
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell 
                        key={column.id} 
                        align={column.align || 'left'}
                        sx={{
                          fontSize: '0.875rem',
                        }}
                      >
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange(parseInt(event.target.value, 10));
          }}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;
