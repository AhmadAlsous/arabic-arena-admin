import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { feedback } from 'src/_mock/feedback';

import Scrollbar from 'src/components/scrollbar';

import FeedbackTableRow from './FeedbackTableRow';
import UserTableHead from '../user/UserTableHead';
import { applyFilter, getComparator } from '../user/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchFeedback } from 'src/services/userServices';
import { Button } from '@mui/base';
import toast from 'react-hot-toast';
import Spinner from 'src/components/Spinner';

export default function FeedbackPage() {
  const {
    data: feedback,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feedback'],
    queryFn: fetchFeedback,
  });
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [orderBy, setOrderBy] = useState('date');

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

  const tableFeedback = feedback
    ? feedback.map((feedback) => ({
        name: feedback.name,
        type: feedback.type,
        text: feedback.text,
        date: new Date(feedback.id),
      }))
    : [];

  const dataFiltered = applyFilter({
    inputData: tableFeedback,
    comparator: getComparator(order, orderBy),
  });

  if (error) {
    toast.error(
      <Stack direction="row" sx={{ mr: '-15px' }}>
        <p>Error fetching feedback.</p>
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
        <Typography variant="h4">Feedback & Problems</Typography>
      </Stack>
      {isLoading && (
        <Stack sx={{ mt: 20, mr: 5 }}>
          <Spinner />
        </Stack>
      )}
      {!isLoading && (
        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'name', label: 'From' },
                    { id: 'type', label: 'Type' },
                    { id: 'text', label: 'Text' },
                    { id: 'date', label: 'Time' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <FeedbackTableRow
                        key={row.date}
                        name={row.name}
                        type={row.type}
                        text={row.text}
                        date={row.date}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={feedback.length}
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
