type LoadingSpinnerProps = {
  clasName?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
};

const sizes = {
  sm: 'h-5 w-5',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const variants = {
  primary: 'border-blue-500',
  inherit: 'border-gray-200',
};

export const LoadingSpinner = ({
  clasName,
  size = 'md',
  variant = 'primary',
}: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center">
      <div
        className={`animate-spin border-4 rounded-full border-t-transparent ${variants[variant]} ${sizes[size]} ${clasName}`}
      ></div>
    </div>
  );
};
