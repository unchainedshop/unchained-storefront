import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import type * as GQL from '../../apollo/generated';

const PrepareUserAvatarUploadMutation = gql`
  mutation PrepareUserAvatarUpload($mediaName: String!) {
    prepareUserAvatarUpload(mediaName: $mediaName) {
      _id
      putURL
    }
  }
`;

const ConfirmMediaUploadMutation = gql`
  mutation ConfirmMediaUpload($mediaUploadTicketId: ID!, $size: Int!, $type: String!) {
    confirmMediaUpload(mediaUploadTicketId: $mediaUploadTicketId, size: $size, type: $type) {
      _id
      url
    }
  }
`;

// The engine hands out a signed upload URL; the file goes there directly and
// is then confirmed so it becomes the user's avatar.
const useUploadAvatar = () => {
  const [uploading, setUploading] = useState(false);
  const [prepare] = useMutation<GQL.PrepareUserAvatarUploadMutation, GQL.PrepareUserAvatarUploadMutationVariables>(
    PrepareUserAvatarUploadMutation,
  );
  const [confirm] = useMutation<GQL.ConfirmMediaUploadMutation, GQL.ConfirmMediaUploadMutationVariables>(
    ConfirmMediaUploadMutation,
    { refetchQueries: ['User'], awaitRefetchQueries: true },
  );

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const { data } = await prepare({ variables: { mediaName: file.name } });
      const { _id, putURL } = data.prepareUserAvatarUpload;
      const response = await fetch(putURL, { method: 'PUT', body: file, headers: { 'content-type': file.type } });
      if (!response.ok) throw new Error(`Upload failed (${response.status})`);
      await confirm({ variables: { mediaUploadTicketId: _id, size: file.size, type: file.type } });
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
};

export default useUploadAvatar;
