interface IBadgeComponentProps {
  label: string;
  variant?: string;
}

const BadgeComponent = ({
  label,
  variant = "success",
}: IBadgeComponentProps) => {
  const base = "px-2.5 py-1 border-1 text-md text-xs rounded-md";
  const styles: Record<string, string> = {
    success: "bg-green-100 text-green-800 border-green-200 ",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    danger: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`${base} ${styles[variant] || styles.green}`}>
      {label}
    </span>
  );
};

export default BadgeComponent;
