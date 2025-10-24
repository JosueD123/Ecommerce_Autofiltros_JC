export function slugify(s: string) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // quita acentos
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'')
}
