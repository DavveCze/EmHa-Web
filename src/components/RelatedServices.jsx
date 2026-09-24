import { useNavigation } from '../context/navigation-core.js'

export default function RelatedServices({
  title = 'Řešíte něco jiného?',
  links = [
    { href: '/rekonstrukce', label: 'Rekonstrukce' },
    { href: '/zabezpeceni', label: 'Zabezpečení' },
    { href: '/opravy-a-servis', label: 'Opravy a servis' },
  ],
}) {
  const { navigate } = useNavigation()

  return (
    <aside className="related container">
      <strong>{title}</strong>
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.href}
          onClick={(e) => {
            e.preventDefault()
            navigate(link.href)
          }}
        >
          {link.label} ↗
        </a>
      ))}
    </aside>
  )
}
