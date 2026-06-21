export default function Button({ children, variant="primary", size="md", onClick, disabled, type="button", className="" }) {
  const variants = { primary:"btn-primary", outline:"btn-outline", ghost:"btn-ghost", danger:"btn-danger" };
  const sizes = { sm:"!px-3 !py-1.5 !text-xs", md:"", lg:"!px-7 !py-3 !text-base" };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${variants[variant]} ${sizes[size]} ${className}`}>{children}</button>;
}
