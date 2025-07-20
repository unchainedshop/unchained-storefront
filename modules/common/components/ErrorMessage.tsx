const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <aside
      style={{
        padding: '1.5em',
        fontSize: '14px',
        color: 'white',
        backgroundColor: 'darkred',
      }}
    >
      {message}
    </aside>
  );
};

export default ErrorMessage;
