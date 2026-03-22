import type { Meta, StoryObj } from '@storybook/react'
import { CheckinRow } from '../../src/components/checkin/CheckinRow'

const meta: Meta<typeof CheckinRow> = {
  title: 'Components/CheckinRow',
  component: CheckinRow,
}

export default meta
type Story = StoryObj<typeof CheckinRow>

export const Pending: Story = {
  args: { customerName: 'João Silva', adults: 2, childCount: 1, voucherCode: 'HK7W3P', checkedIn: false },
}

export const CheckedIn: Story = {
  args: { customerName: 'Maria Santos', adults: 3, childCount: 0, voucherCode: 'AB3K9R', checkedIn: true },
}

export const ManifestList: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <CheckinRow customerName="João Silva" adults={2} childCount={1} voucherCode="HK7W3P" checkedIn={true} />
      <CheckinRow customerName="Maria Santos" adults={3} childCount={0} voucherCode="AB3K9R" checkedIn={false} />
      <CheckinRow customerName="Pedro Oliveira" adults={1} childCount={0} voucherCode="FG5T2N" checkedIn={false} />
      <CheckinRow customerName="Ana Costa e família" adults={4} childCount={2} voucherCode="LM8Y4D" checkedIn={false} />
    </div>
  ),
}
