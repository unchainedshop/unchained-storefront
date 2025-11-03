import AddressForm from './AddressForm';
import AddressPanel from './AddressPanel';

const EditableAddressPanel = ({ editing, address, onSubmit, onToggle }) => {
  if (editing)
    return (
      <AddressForm address={address} onSubmit={onSubmit} onCancel={onToggle} />
    );
  return <AddressPanel address={address} onEdit={onToggle} />;
};

export default EditableAddressPanel;
