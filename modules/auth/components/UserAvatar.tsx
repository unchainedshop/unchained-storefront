import classNames from 'classnames';
import toast from 'react-hot-toast';
import { useIntl } from 'react-intl';
import { CameraIcon } from '@heroicons/react/24/outline';
import useUploadAvatar from '../hooks/useUploadAvatar';

const MAX_SIZE = 5 * 1024 * 1024;

// Photo or initials; when editable, verified customers can upload a new photo.
const UserAvatar = ({ user, initials, editable = false, className = 'size-10' }) => {
  const { formatMessage } = useIntl();
  const { uploadAvatar, uploading } = useUploadAvatar();
  const canUpload = editable && user?.primaryEmail?.verified;

  const face = (
    <span
      className={classNames(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground',
        className,
      )}
    >
      {user?.avatar?.url ? <img src={user.avatar.url} alt="" className="size-full object-cover" /> : initials}
      {canUpload && (
        <span className="absolute inset-0 flex items-center justify-center bg-overlay opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
          ) : (
            <CameraIcon className="size-4 text-white" />
          )}
        </span>
      )}
    </span>
  );

  if (!editable) return face;
  if (!canUpload)
    return (
      <span title={formatMessage({ id: 'avatar_verify_email', defaultMessage: 'Verify your email address to add a photo' })}>
        {face}
      </span>
    );

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_SIZE) {
      toast.error(formatMessage({ id: 'avatar_too_large', defaultMessage: 'Please choose an image under 5 MB.' }));
      return;
    }
    try {
      await uploadAvatar(file);
      toast.success(formatMessage({ id: 'avatar_updated', defaultMessage: 'Profile photo updated' }));
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <label className="group cursor-pointer" aria-label={formatMessage({ id: 'avatar_change', defaultMessage: 'Change profile photo' })}>
      {face}
      <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={onChange} />
    </label>
  );
};

export default UserAvatar;
