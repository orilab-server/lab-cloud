import React, { FormHTMLAttributes, ReactNode } from 'react';

type ModalFormProps = {
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

const ModalForm = ({ children, ...props }: ModalFormProps) => {
  return (
    <form className="flex flex-col items-start w-full space-y-4" {...props}>
      {children}
    </form>
  );
};

export default React.memo(ModalForm);
