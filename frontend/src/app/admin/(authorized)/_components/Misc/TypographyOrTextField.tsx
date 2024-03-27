'use client';

import React, { InputHTMLAttributes } from 'react';
import { Control, Controller } from 'react-hook-form';

type TypographyOrTextFieldProps = {
  titleElement: React.ReactNode;
  control: Control<any, any>;
  edit: boolean;
  value: string | number;
  multiline?: boolean;
} & InputHTMLAttributes<HTMLInputElement> &
  InputHTMLAttributes<HTMLTextAreaElement>;

export const TypographyOrTextField = ({
  titleElement,
  control,
  edit,
  multiline,
  ...props
}: TypographyOrTextFieldProps) => {
  return (
    <>
      {edit ? (
        <>
          <div className="form-control w-full">
            <label
              className="w-full text-sm label bg-gray-200 text-gray-900 rounded my-1"
              htmlFor={props.name!}
            >
              {titleElement}
            </label>
            <Controller
              name={props.name!}
              control={control}
              render={({ field }) => (
                <>
                  {multiline ? (
                    <textarea
                      className="textarea textarea-bordered"
                      rows={5}
                      {...props}
                      {...field}
                    ></textarea>
                  ) : (
                    <input className="w-full input input-bordered" {...props} {...field} />
                  )}
                </>
              )}
            />
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-start">
          <span className="label w-full text-sm bg-gray-200 text-gray-900 rounded my-1">
            {titleElement}
          </span>
          <span className="text-lg">{props.value}</span>
        </div>
      )}
    </>
  );
};
