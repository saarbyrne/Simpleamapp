import { PageFrame } from '@/components/dashboard/page-frame'
import { OrganizationsFeaturesTable } from './organizations-features-table'

export default async function FeaturesPage() {
  return (
    <PageFrame>
      <OrganizationsFeaturesTable />
    </PageFrame>
  )
}
