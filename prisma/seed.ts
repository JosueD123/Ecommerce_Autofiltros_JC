import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  const brand = await prisma.brand.upsert({
    where: { name: 'ACDelco' },
    update: {},
    create: { name: 'ACDelco' }
  })
  const cat = await prisma.category.upsert({
    where: { slug: 'filtros-aceite' },
    update: {},
    create: { name: 'Filtros de Aceite', slug: 'filtros-aceite' }
  })
  await prisma.product.upsert({
    where: { sku: 'ACD-OP123' },
    update: {},
    create: {
      sku: 'ACD-OP123',
      name: 'Filtro de Aceite ACDelco OP123',
      slug: 'filtro-aceite-acdelco-op123',
      description: 'Filtro de aceite para motores GM. OEM 889123',
      price: 85.00,
      cost: 55.00,
      stock: 20,
      brandId: brand.id,
      categoryId: cat.id,
      images: { create: [{ url: '/images/demo/filtro1.jpg', isPrimary: true }] }
    }
  })
}

main().finally(()=>prisma.$disconnect())
