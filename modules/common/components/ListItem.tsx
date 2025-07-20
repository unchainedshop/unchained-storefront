const ListItem = ({ title = '', value = '' } = {}) => {
  return (
    <div className="text-right">
      <div className="border-top mt-0 py-3">
        <div className="d-flex justify-content-between flex-wrap">
          <div>{title}</div>
          <div>{value}</div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
