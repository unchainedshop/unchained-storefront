import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { USER_QUERY } from '../../auth/hooks/useUser';

const AddBookmarkMutation = gql`
  mutation Bookmark($productId: ID!) {
    bookmark(productId: $productId) {
      _id
    }
  }
`;

const useBookmarkProduct = () => {
  const [bookmarkProductMutation] = useMutation<any>(AddBookmarkMutation, {
    refetchQueries: [{ query: USER_QUERY }],
    awaitRefetchQueries: true,
  });

  const bookmarkProduct = async ({ productId }) => {
    await bookmarkProductMutation({ variables: { productId } });
  };

  return {
    bookmarkProduct,
  };
};

export default useBookmarkProduct;
