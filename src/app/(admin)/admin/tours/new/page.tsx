'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { tourSchema, type TourInput } from '@/lib/validations'
import { ArrowLeft, Save } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminTourNewPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: '' as string,
    duration: '',
    priceAdult: '',
    priceChild: '',
    maxCapacity: '',
    commissionRate: '10',
    images: '',
  })

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }))
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const data: TourInput = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      category: form.category as TourInput['category'],
      duration: form.duration,
      priceAdult: parseFloat(form.priceAdult) || 0,
      priceChild: form.priceChild ? parseFloat(form.priceChild) : undefined,
      maxCapacity: parseInt(form.maxCapacity) || 0,
      commissionRate: (parseFloat(form.commissionRate) || 0) / 100,
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      includes: [],
      isActive: true,
    }

    const parsed = tourSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const json = await res.json()
        setErrors({ _form: json.error || 'Erro ao salvar passeio' })
        return
      }

      router.push('/admin/tours')
    } catch {
      setErrors({ _form: 'Erro de conexao. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <ButtonLink href="/admin/tours" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </ButtonLink>
        <div>
          <h1 className="text-2xl font-bold">Novo Passeio</h1>
          <p className="text-muted-foreground">Preencha os dados do passeio</p>
        </div>
      </div>

      {errors._form && (
        <div className="rounded-lg bg-destructive/10 text-destructive p-3 text-sm">
          {errors._form}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome do Passeio</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Passeio de Barco Corumbau"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="passeio-barco-corumbau"
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Descreva o passeio em detalhes..."
                  rows={4}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHALE">Baleia</SelectItem>
                    <SelectItem value="BOAT">Barco</SelectItem>
                    <SelectItem value="BUGGY">Buggy</SelectItem>
                    <SelectItem value="EXPERIENCE">Experiencia</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duracao</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  placeholder="Ex: 3 horas"
                />
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceAdult">Preco Adulto (R$)</Label>
                <Input
                  id="priceAdult"
                  type="number"
                  step="0.01"
                  value={form.priceAdult}
                  onChange={(e) => updateField('priceAdult', e.target.value)}
                  placeholder="0,00"
                />
                {errors.priceAdult && <p className="text-sm text-destructive">{errors.priceAdult}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceChild">Preco Crianca (R$)</Label>
                <Input
                  id="priceChild"
                  type="number"
                  step="0.01"
                  value={form.priceChild}
                  onChange={(e) => updateField('priceChild', e.target.value)}
                  placeholder="0,00 (opcional)"
                />
                {errors.priceChild && <p className="text-sm text-destructive">{errors.priceChild}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacidade Maxima</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={form.maxCapacity}
                  onChange={(e) => updateField('maxCapacity', e.target.value)}
                  placeholder="Ex: 20"
                />
                {errors.maxCapacity && <p className="text-sm text-destructive">{errors.maxCapacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">Comissao (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="1"
                  value={form.commissionRate}
                  onChange={(e) => updateField('commissionRate', e.target.value)}
                  placeholder="10"
                />
                {errors.commissionRate && <p className="text-sm text-destructive">{errors.commissionRate}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="images">Imagens (URLs separadas por virgula)</Label>
                <Input
                  id="images"
                  value={form.images}
                  onChange={(e) => updateField('images', e.target.value)}
                  placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
                />
                {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Passeio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
