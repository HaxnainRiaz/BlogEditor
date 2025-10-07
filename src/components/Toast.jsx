import React from 'react';

const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="toast">
      {toast}
    </div>
  );
};

export default Toast;