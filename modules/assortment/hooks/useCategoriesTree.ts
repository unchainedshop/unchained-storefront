import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import childrenArrayToNavigationIdObject from '../utils/childrenArrayToNavigationIdObject';

export const ASSORTMENT_TREE_QUERY = gql`
  query AssortmentTree($slugs: [String!], $includeLeaves: Boolean) {
    assortments(slugs: $slugs, includeLeaves: $includeLeaves) {
      ...AssortmentFragment
      media {
        ...AssortmentMediaFragment
      }
      children {
        ...AssortmentFragment
        media {
          ...AssortmentMediaFragment
        }
        children {
          ...AssortmentFragment
          media {
            ...AssortmentMediaFragment
          }
        }
      }
    }
  }
  ${AssortmentFragment}
  ${AssortmentMediaFragment}
`;

const useCategoriesTree = ({
  includeLeaves = false,
  slugs,
  root = 'shop',
}: {
  slugs?: string[];
  includeLeaves?: boolean;
  root?: string;
}) => {
  const { loading, error, data } = useQuery<any>(ASSORTMENT_TREE_QUERY, {
    variables: {
      includeLeaves,
      slugs,
    },
  });

  // TODO REFACTOR: This would be nicer with `walk`
  const assortments = childrenArrayToNavigationIdObject(
    (data?.assortments || []).map((assortment) => ({
      ...assortment,
      children: childrenArrayToNavigationIdObject(
        assortment.children.map((subAssortment) => ({
          ...subAssortment,
          children: childrenArrayToNavigationIdObject(subAssortment.children, [
            root,
            assortment.texts.slug,
            subAssortment.texts.slug,
          ]),
        })),
        [root, assortment.texts.slug],
      ),
    })),
  );
  const assortmentTree = {
    navigationTitle: root,
    slug: root,
    path: [root],
    children: assortments,
  };

  return { loading, error, assortmentTree };
};

export default useCategoriesTree;
