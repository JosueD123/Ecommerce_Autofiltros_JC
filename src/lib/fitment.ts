// src/lib/fitment.ts
import { prisma } from '@/lib/prisma'

export async function getProductFitments(productId: number) {
  const rows = await prisma.productFitment.findMany({
    where: { productId },
    include: {
      variant: {
        include: {
          model: { include: { make: true } }
        }
      }
    },
    orderBy: [
      { variant: { model: { make: { name: 'asc' } } } },
      { variant: { model: { name: 'asc' } } },
      { variant: { year: 'asc' } },
    ],
  })

  const tree: Record<string, Record<string, number[]>> = {}
  for (const r of rows) {
    const make = r.variant.model.make.name
    const model = r.variant.model.name
    const year = r.variant.year
    tree[make] ??= {}
    tree[make][model] ??= []
    tree[make][model].push(year)
  }
  return tree
}

export function compactYearRanges(years: number[]): string {
  const sorted = [...new Set(years)].sort((a,b)=>a-b)
  const ranges: string[] = []
  let start = sorted[0], prev = sorted[0]
  for (let i=1;i<sorted.length;i++){
    const y = sorted[i]
    if (y === prev + 1) { prev = y; continue }
    ranges.push(start === prev ? `${start}` : `${start}–${prev}`)
    start = prev = y
  }
  if (start !== undefined) ranges.push(start === prev ? `${start}` : `${start}–${prev}`)
  return ranges.join(', ')
}
