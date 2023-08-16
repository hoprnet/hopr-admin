import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import _debounce from 'lodash/debounce';

// Mui
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
import TextField from '@mui/material/TextField'


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

`

const STableCell = styled(TableCell)`
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8px 16px;
  max-width: calc( 100% - 168px);
  &.actions{ 
    overflow: unset;
  }
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

const OverTable = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  &.searchIncluded {
    justify-content: space-between;
  }
`

const STextField = styled(TextField)`
  flex-grow: 1;
  margin: 0px 16px;
`

interface Props {
  data: any[],
  header: any[],
  search?: boolean
}

export default function CustomPaginationActionsTable(props: Props) {
  const [page, set_Page] = React.useState(0);
  const [rowsPerPage, set_RowsPerPage] = React.useState(10);
  const [searchPhrase, set_searchPhrase] = React.useState('');
  const [filteredData, set_filteredData] = React.useState<any[]>([]);

  useEffect(() => {
    filterData(searchPhrase);
  }, [props.data]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    set_Page(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    set_RowsPerPage(parseInt(event.target.value, 10));
    set_Page(0);
  };

  const debounceFn = useCallback(
    _debounce(filterData, 150), 
    [props.data]
  );

  function handleSearchChange(event: { target: { value: string }; }) {
    let search: string = event.target.value;
    set_searchPhrase(search);
    debounceFn(search);
  };

  function filterData(searchPhrase: string) {
    set_Page(0);

    let data = props.data;
    let filterBy = props.header.map(elem => elem.search === true && elem.key);
    filterBy = filterBy.filter(elem => elem);

    // SearchPhrase filter
    if (!searchPhrase || searchPhrase === '' ) {
      set_filteredData(data);
      return;
    }
    const filtered = data.filter(elem => {
      for(let i = 0; i < filterBy.length; i++) {
        if (elem[filterBy[i]].toLowerCase().includes(searchPhrase.toLowerCase())) return true;
      }
    });
    set_filteredData(filtered);
    return;
  }


  return (
    <TableContainer component={Paper}>
      <OverTable
        className={`OverTable ${props.search ? 'searchIncluded' : ''}`}
      >
        {
          props.search &&
          <STextField
            label="Search"
            variant="standard"
            value={searchPhrase}
            onChange={handleSearchChange}
          />
        }
        <TablePagination
          rowsPerPageOptions={[10, 50, { label: 'All', value: -1 }]}
          colSpan={props.header.length-1}
          count={filteredData.length}
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
          component={'div'}
        />
      </OverTable>
      <STable aria-label="custom pagination table">
        <thead>
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
            ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filteredData
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
          {!props.data || props.data.length === 0 && 
            <>
              <TableRow style={{ height: 57 }}>
                <STableCell colSpan={props.header.length}>
                  No entries
                </STableCell>
              </TableRow>
              <TableRow style={{ height: 57 * (rowsPerPage - 1) }}>
                <STableCell colSpan={props.header.length} />
              </TableRow>
            </>
          }
          {emptyRows > 0 && (
            <TableRow style={{ height: 57 * emptyRows }}>
              <STableCell colSpan={props.header.length} />
            </TableRow>
          )}
        </TableBody>
      </STable>
    </TableContainer>
  );
}