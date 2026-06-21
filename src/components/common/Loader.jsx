export default function Loader({ size="md" }) {
  const s = { sm:"w-4 h-4 border-2", md:"w-8 h-8 border-2", lg:"w-12 h-12 border-3" };
  return <div className={`${s[size]} border-gray-200 border-t-primary rounded-full animate-spin`}/>;
}
