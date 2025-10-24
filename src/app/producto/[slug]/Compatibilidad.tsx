// src/app/(public)/producto/[slug]/Compatibilidad.tsx
import { getProductFitments, compactYearRanges } from '@/lib/fitment'

export default async function Compatibilidad({ productId }: { productId: number }) {
  const tree = await getProductFitments(productId)

  const makes = Object.keys(tree)
  if (makes.length === 0) {
    return <p className="text-sm text-gray-600">Aún no registramos compatibilidades para este producto.</p>
  }

  return (
    <div className="space-y-4">
      {makes.map(make => {
        const models = tree[make]
        const modelNames = Object.keys(models)
        return (
          <div key={make}>
            <h4 className="font-semibold">{make}</h4>
            <ul className="ml-4 list-disc">
              {modelNames.map(model => {
                const years = models[model]
                return (
                  <li key={model}>
                    <span className="font-medium">{model}</span>{' '}
                    <span className="text-gray-600">({compactYearRanges(years)})</span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
