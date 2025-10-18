// src/app/api/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'
import { verifyToken } from '@/lib/auth'

// ✅ fuerza runtime Node (upload_stream necesita Node, no Edge)
export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const COOKIE_NAME = 'app_session'

function forbid(msg = 'Unauthorized', status = 401) {
  return NextResponse.json({ message: msg }, { status })
}

export async function POST(req: NextRequest) {
  // 1) Autenticación con la MISMA cookie del sitio
  const jar = await cookies()
  const raw = jar.get(COOKIE_NAME)?.value || ''
  const payload = verifyToken(raw)
  if (!payload) return forbid('Unauthorized', 401)
  if (payload.role !== 'ADMIN' && payload.role !== 'SELLER') {
    return forbid('Forbidden', 403)
  }

  try {
    // 2) Obtener archivo (clave debe ser "file")
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ message: 'file required' }, { status: 400 })

    // 3) Convertir a Buffer y subir con upload_stream
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'autofiltros' },
        (err, res) => (err ? reject(err) : resolve(res))
      )
      stream.end(buffer)
    })

    // 4) Respuesta
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (e: any) {
    console.error('upload error:', e)
    return NextResponse.json({ message: e?.message || 'Error' }, { status: 500 })
  }
}
