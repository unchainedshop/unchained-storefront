import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import AddressFragment from '../../common/fragments/AddressFragment';

const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($profile: UserProfileInput!, $userId: ID!) {
    updateUserProfile(profile: $profile, userId: $userId) {
      _id
      profile {
        phoneMobile
        address {
          ...AddressFragment
        }
      }
    }
  }
  ${AddressFragment}
`;

const useUpdateUserProfile = () => {
  const [updateUserProfileMutation, { error }] = useMutation<any>(
    UPDATE_USER_PROFILE_MUTATION,
  );

  const updateUserProfile = async ({ profile, userId }) => {
    return updateUserProfileMutation({
      variables: { userId, profile },
    });
  };

  return {
    updateUserProfile,
    error,
  };
};

export default useUpdateUserProfile;
