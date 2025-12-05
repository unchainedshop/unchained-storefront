import useQRCodeGenerator from "react-hook-qrcode-svg";

const QRCODE_LEVEL = "H";
const QRCODE_BORDER = 0;

export const QRCode = ({ value }) => {
  const { path, viewBox } = useQRCodeGenerator(
    value,
    QRCODE_LEVEL,
    QRCODE_BORDER,
  );
  return (
    <svg width="100%" height="100%" viewBox={viewBox} stroke="none">
      <rect width="100%" height="100%" fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
};

export default QRCode;
