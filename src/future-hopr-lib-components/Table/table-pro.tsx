import * as React from 'react';
import styled from '@emotion/styled';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Tooltip from '@mui/material/Tooltip'

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}


const STable = styled(Table)`
  /* table-layout: fixed; */
 // width: 350px;
  /* table-layout: fixed; */
  /*  min-width: 400px;
  max-width: 400px; */
  /* width: 100%;  */
`

const STableCell = styled(TableCell)`
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* span {
    max-width: 446px;
  } */
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */

  &.actions{ 
    /* max-width: 164px; */
    overflow: unset;
    /* text-overflow: unset; */
    /* width: auto; */
  //  width: 250px;
    /*  max-width: 80px;
    min-width: 80px; 
    
    white-space: nowrap;  */
  }
 /*  &.wrap {
    text-wrap: wrap;
    overflow-wrap: anywhere;
  }
  span {
    white-space: nowrap; 
    text-overflow:ellipsis; 
    overflow: hidden;
  } */
`


function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


const TableHeader = styled.div`
  width: 100%;
`

interface Props {
  data: any[],
  header: any[],
}

export default function CustomPaginationActionsTable(props: Props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log('props', props);

  return (
    <TableContainer component={Paper}>
      <STable aria-label="custom pagination table">
        <thead>
          <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 50, { label: 'All', value: -1 }]}
                colSpan={props.header.length}
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
          </TableRow>
          <TableRow>
              {
                props.header.map(headElem => (
                  <STableCell 
                    className={`TableCell TableCellHeader`}
                    width={headElem.width}
                  >
                    {headElem.name}
                  </STableCell>
                ))
              }
          </TableRow>
        </thead>
        <TableBody>
          {(rowsPerPage > 0
            ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : props.data
          ).map((row) => (
            <TableRow key={row.name}>
              {
                props.header.map(headElem => (
                  <STableCell 
                    className={`TableCell ${headElem.key} ${headElem.wrap ? 'wrap' : ''} ${headElem.maxWidth ? 'wrap' : ''}`}
                    width={headElem.width}
                    style={{maxWidth: headElem.maxWidth}}
                  >
                    {
                      headElem.tooltip ?
                      <Tooltip
                        title={row[headElem.key]}
                      >
                        {row[headElem.key]}
                      </Tooltip>
                      :
                      row[headElem.key]
                    }
                  </STableCell>
                ))
              }
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <STableCell colSpan={props.header.length} />
            </TableRow>
          )}
        </TableBody>
      </STable>
    </TableContainer>
  );
}