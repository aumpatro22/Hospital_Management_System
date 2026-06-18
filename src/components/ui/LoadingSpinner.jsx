const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="loading-overlay">
    <div className="spinner" />
    <p style={{ fontSize: 14, fontWeight: 500 }}>{text}</p>
  </div>
);
export default LoadingSpinner;
