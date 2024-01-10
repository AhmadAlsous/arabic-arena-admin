import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from './TableNoData';
import UserTableRow from './UserTableRow';
import UserTableHead from './UserTableHead';
import UserTableToolbar from './UserSearch';
import { applyFilter, getComparator } from './utils';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from 'src/services/userServices';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import Spinner from 'src/components/Spinner';

export default function UserPage() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const tableUsers = users
    ? users.map((user) => {
        const { id, firstName, lastName, level, language } = user;
        return {
          name: `${firstName} ${lastName}`,
          email: id,
          level,
          language,
        };
      })
    : [];

  const dataFiltered = applyFilter({
    inputData: tableUsers,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (error) {
    toast.error(
      <Stack direction="row" sx={{ mr: '-15px' }}>
        <p>Error fetching users.</p>
        <Button
          sx={{
            textTransform: 'none',
            color: 'black',
            fontSize: '0.95rem',
          }}
          onClick={() => {
            refetch();
            toast.remove();
          }}
        >
          Try again?
        </Button>
      </Stack>,
      { duration: 5000 }
    );
    return;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
      </Stack>
      {isLoading && (
        <Stack sx={{ mt: 20, mr: 5 }}>
          <Spinner />
        </Stack>
      )}
      {!isLoading && (
        <Card>
          <UserTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'level', label: 'Level' },
                    { id: 'language', label: 'Language' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.email}
                        name={row.name}
                        email={row.email}
                        level={row.level}
                        language={row.language}
                      />
                    ))}
                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </Container>
  );
}
