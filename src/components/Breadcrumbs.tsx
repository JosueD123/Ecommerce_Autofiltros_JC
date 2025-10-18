import Link from 'next/link'

export default function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[]
}) {
  return (
    <nav className="text-sm text-gray-500 mb-3">
      {items.map((it, i) => (
        <span key={i}>
          {it.href ? (
            <Link href={it.href} className="hover:underline">{it.label}</Link>
          ) : (
            <span className="text-gray-700">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="px-1">/</span>}
        </span>
      ))}
    </nav>
  )
}
