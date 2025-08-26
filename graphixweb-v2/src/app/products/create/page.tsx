'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductService } from '@/lib/api'
import type { CreateProductRequest } from '@/types/api'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

// Schema de validação
const productSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  finish: z.string().optional(),
  color: z.string().optional(),
  dimension: z.string().optional(),
  knife: z.string().optional(),
  tubet: z.string().optional(),
  material: z.string().optional(),
  observation: z.string().optional()
})

type ProductFormData = z.infer<typeof productSchema>

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true)
      setError(null)

      const request: CreateProductRequest = {
        description: data.description,
        finish: data.finish || undefined,
        color: data.color || undefined,
        dimension: data.dimension || undefined,
        knife: data.knife || undefined,
        tubet: data.tubet || undefined,
        material: data.material || undefined,
        observation: data.observation || undefined
      }

      await ProductService.create(request)
      router.push('/products')
    } catch (err: any) {
      setError(err.error || 'Erro ao criar produto')
      console.error('Erro ao criar produto:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Novo Produto</h1>
              <p className="text-gray-600 mt-1">Cadastre um novo produto no catálogo</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição do Produto *
                  </label>
                  <Input
                    {...register('description')}
                    placeholder="Digite a descrição do produto"
                    error={errors.description?.message}
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <Input
                    {...register('material')}
                    placeholder="Ex: Papel couché, Vinil, BOPP"
                    error={errors.material?.message}
                  />
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <Input
                    {...register('color')}
                    placeholder="Ex: Branco, Transparente, Colorido"
                    error={errors.color?.message}
                  />
                </div>

                {/* Dimensão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensão
                  </label>
                  <Input
                    {...register('dimension')}
                    placeholder="Ex: 100x50mm, 200x100mm"
                    error={errors.dimension?.message}
                  />
                </div>

                {/* Acabamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acabamento
                  </label>
                  <Input
                    {...register('finish')}
                    placeholder="Ex: Fosco, Brilhante, Verniz UV"
                    error={errors.finish?.message}
                  />
                </div>

                {/* Faca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faca
                  </label>
                  <Input
                    {...register('knife')}
                    placeholder="Especificação da faca de corte"
                    error={errors.knife?.message}
                  />
                </div>

                {/* Tubo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tubo
                  </label>
                  <Input
                    {...register('tubet')}
                    placeholder="Especificação do tubo"
                    error={errors.tubet?.message}
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    {...register('observation')}
                    placeholder="Informações adicionais sobre o produto..."
                    rows={4}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.observation && (
                    <p className="mt-1 text-sm text-red-600">{errors.observation.message}</p>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/products')}
                  className="flex items-center gap-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={loading}
                >
                  Limpar Formulário
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card com Dicas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">💡 Dicas para Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">Descrição:</p>
                <p>Use nomes claros e específicos que facilitem a identificação</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Material:</p>
                <p>Especifique o tipo de material base (papel, vinil, etc.)</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Dimensões:</p>
                <p>Sempre inclua as unidades (mm, cm) para evitar confusões</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Observações:</p>
                <p>Inclua informações importantes para produção e orçamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}