import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam }) => {
      const response = await api.get('api/images', {
        params: {
          after: pageParam,
        },
      });
      const dataImages = response.data;

      return dataImages;
    },
    {
      getNextPageParam: lastPage => lastPage.after,
    }
  );

  console.log(hasNextPage);

  const formattedData = useMemo(() => {
    if (!data) {
      return null;
    }
    const pages = data.pages.map(page => page.data).flat();

    return pages;
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {isLoading && <Loading />}
        {isError && <Error />}

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            marginTop={4}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
