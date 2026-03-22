'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommissionRow } from '@/components/admin/CommissionRow'
import { DollarSign, CheckCircle } from 'lucide-react'

interface Commission {
  id: string
  operatorName: string
  tourName: string
  date: string
  amount: number
  percentage: number
  isPaid: boolean
}

const MOCK_COMMISSIONS: Commission[] = [
  { id: 'c1', operatorName: 'Carlos Silva', tourName: 'Passeio de Barco Corumbau', date: '25/03/2026', amount: 54, percentage: 10, isPaid: false },
  { id: 'c2', operatorName: 'Maria Santos', tourName: 'Avistamento de Baleias', date: '24/03/2026', amount: 75, percentage: 10, isPaid: false },
  { id: 'c3', operatorName: 'Carlos Silva', tourName: 'Buggy ate Caraiva', date: '23/03/2026', amount: 45, percentage: 10, isPaid: false },
  { id: 'c4', operatorName: 'Maria Santos', tourName: 'Mergulho nos Recifes', date: '22/03/2026', amount: 96, percentage: 10, isPaid: true },
  { id: 'c5', operatorName: 'Carlos Silva', tourName: 'Passeio de Barco Corumbau', date: '21/03/2026', amount: 54, percentage: 10, isPaid: true },
  { id: 'c6', operatorName: 'Maria Santos', tourName: 'Avistamento de Baleias', date: '20/03/2026', amount: 75, percentage: 10, isPaid: true },
  { id: 'c7', operatorName: 'Carlos Silva', tourName: 'Buggy ate Caraiva', date: '19/03/2026', amount: 45, percentage: 10, isPaid: false },
]

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('all')

  const pendingCommissions = commissions.filter((c) => !c.isPaid)
  const paidCommissions = commissions.filter((c) => c.isPaid)
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.amount, 0)

  function handleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleMarkAsPaid() {
    if (selected.size === 0) return
    setCommissions((prev) =>
      prev.map((c) => (selected.has(c.id) ? { ...c, isPaid: true } : c))
    )
    setSelected(new Set())
  }

  function handleSelectAll() {
    const allPendingIds = pendingCommissions.map((c) => c.id)
    setSelected(new Set(allPendingIds))
  }

  const filtered =
    activeTab === 'pending' ? pendingCommissions :
    activeTab === 'paid' ? paidCommissions :
    commissions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comissoes</h1>
          <p className="text-muted-foreground">Gerencie pagamentos de comissoes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Pendente</p>
            <p className="text-lg font-bold">R$ {totalPending.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              Todas
              <Badge variant="outline" className="ml-2">{commissions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes
              <Badge variant="outline" className="ml-2">{pendingCommissions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="paid">
              Pagas
              <Badge variant="outline" className="ml-2">{paidCommissions.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {activeTab !== 'paid' && pendingCommissions.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Selecionar Pendentes
              </Button>
              <Button
                size="sm"
                onClick={handleMarkAsPaid}
                disabled={selected.size === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Pago ({selected.size})
              </Button>
            </div>
          )}
        </div>

        <TabsContent value={activeTab} className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma comissao encontrada</p>
            </div>
          ) : (
            filtered.map((commission) => (
              <CommissionRow
                key={commission.id}
                operatorName={commission.operatorName}
                tourName={commission.tourName}
                date={commission.date}
                amount={commission.amount}
                percentage={commission.percentage}
                isPaid={commission.isPaid}
                selected={selected.has(commission.id)}
                onSelect={(checked) => handleSelect(commission.id, checked as boolean)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
