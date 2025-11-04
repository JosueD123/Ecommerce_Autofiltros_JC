// src/app/api/orders/[id]/receipt/route.ts
import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { readFile } from 'fs/promises'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await ctx.params
  const id = Number(idStr || 0)
  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, sku: true, price: true } },
        },
      },
    },
  })
  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  // ---------- PDF ----------
  const pdf = await PDFDocument.create()
  const A4: [number, number] = [595.28, 841.89]
  const page = pdf.addPage(A4)

  const margin = 48
  let y = A4[1] - margin

  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const drawText = (
    text: string,
    x: number,
    opts?: { size?: number; color?: ReturnType<typeof rgb>; bold?: boolean }
  ) => {
    const size = opts?.size ?? 11
    page.drawText(text, {
      x,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: opts?.color ?? rgb(0, 0, 0),
    })
  }

  const drawRight = (
    text: string,
    xRight: number,
    opts?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb> }
  ) => {
    const size = opts?.size ?? 11
    const width =
      (opts?.bold ? bold : font).widthOfTextAtSize(text, size)
    page.drawText(text, {
      x: xRight - width,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: opts?.color ?? rgb(0, 0, 0),
    })
  }

  const line = (x1: number, x2: number, col = rgb(0.85, 0.85, 0.85)) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness: 1,
      color: col,
    })
  }
  const down = (px: number) => { y -= px }

  // ---------- Header con LOGO ----------
  // lee /public/images/logoJC.png
  let logoBytes: Uint8Array | null = null
  try {
    const logoPath = `${process.cwd()}/public/images/logoJC.png`
    logoBytes = await readFile(logoPath)
  } catch {
    logoBytes = null // si no existe, seguimos sin logo
  }

  if (logoBytes) {
    const logo = await pdf.embedPng(logoBytes)
    const w = 120
    const h = (logo.height / logo.width) * w
    page.drawImage(logo, { x: margin, y: y - h + 10, width: w, height: h })
  }

  // Texto de empresa a la derecha del logo
  const headerX = margin + (logoBytes ? 140 : 0)
  drawText('Autofiltros JC, S.A.', headerX, { size: 18, bold: true })
  down(20)
  drawText('Filtros y accesorios automotrices en Guatemala', headerX, { size: 10, color: rgb(0.33, 0.33, 0.33) })
  down(14)
  drawText('Tel: +502 4498 4479 · ventas@grupojcautomotriz.com', headerX, { size: 10, color: rgb(0.33, 0.33, 0.33) })

  // Mueve el cursor por debajo del logo si lo hay
  y = A4[1] - margin - 60
  down(16)
  drawText('Recibo de compra', margin, { size: 18, bold: true })
  down(18)
  drawText(`Pedido No.: ${order.id}`, margin)
  down(14)
  drawText(`Fecha: ${order.createdAt.toLocaleString('es-GT')}`, margin)
  down(10)
  line(margin, A4[0] - margin)
  down(12)

  // ---------- Tabla ----------
  const colProducto = margin
  const colCant = 360     // más a la izquierda
  const colUnit = 430     // columna de precio unitario
  const colImporte = 510  // columna de importe final
  const tableRight = A4[0] - margin

  // Encabezado tabla
  drawText('Producto', colProducto, { bold: true })
  drawText('Cant.', colCant, { bold: true })
  drawText('P. Unit.', colUnit, { bold: true })
  drawText('Importe', colImporte, { bold: true })
  down(14)
  line(margin, tableRight)
  down(8)

  let subtotal = 0
  const rowHeight = 18
  const lightGray = rgb(0.96, 0.96, 0.96)

  const drawRowBg = () => {
    page.drawRectangle({
      x: margin,
      y: y - (rowHeight - 6),
      width: A4[0] - margin * 2,
      height: rowHeight - 6,
      color: lightGray,
      opacity: 0.35,
      borderColor: rgb(0.9, 0.9, 0.9),
      borderWidth: 0.5,
    })
  }

  // Filas
  order.items.forEach((it, idx) => {
    const qty = Number((it as any).qty ?? (it as any).quantity ?? 1)
    const unit = Number((it as any).price ?? (it as any).unitPrice ?? it.product?.price ?? 0)
    const totalLine = qty * unit
    subtotal += totalLine

    const name = it.product?.name ?? 'Producto'
    const sku = it.product?.sku ? ` (${it.product.sku})` : ''

    if (idx % 2 === 1) drawRowBg()

    drawText(`${name}${sku}`, colProducto)
    drawRight(String(qty), colCant + 20)
    drawRight(`Q ${unit.toFixed(2)}`, colUnit + 55)
    drawRight(`Q ${totalLine.toFixed(2)}`, colImporte + 55)

    down(rowHeight)
  })

  // Separador y total
  down(4)
  line(margin, tableRight)
  down(10)
  drawText('Total', colUnit + 25, { bold: true })
  drawRight(`Q ${(Number(order.total ?? subtotal)).toFixed(2)}`, colImporte + 55, { bold: true })
  down(24)
  drawText(
    'Este documento es un comprobante no fiscal emitido por Autofiltros JC, S.A.',
    margin,
    { size: 9, color: rgb(0.4, 0.4, 0.4) }
  )


  const pdfBytes = await pdf.save()
  return new NextResponse(pdfBytes as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="recibo_${order.id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}



