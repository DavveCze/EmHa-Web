import { useNavigation } from '../context/navigation-core.js'

export default function AnchorNav({
  items = [
    { href: '#soucasti', number: '01', label: 'Co zajistíme' },
    { href: '#detaily', number: '02', label: 'Na co myslet' },
    { href: '#otazky', number: '03', label: 'Časté otázky' },
  ],
}) {
  const { navigate } = useNavigation()

  return (
    <nav className="anchor-nav container" aria-label="Sekce stránky">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          onClick={(e) => {
            e.preventDefault()
            navigate(item.href)
          }}
        >
          <b>{item.number}</b>
          {item.label}
        </a>
      ))}
    </nav>
  )
}
