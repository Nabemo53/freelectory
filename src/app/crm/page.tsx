import { AppShell } from "@/components/layout/app-shell";
import { CrmTable } from "@/components/features/crm-table";
import { PageHeading } from "@/components/features/page-heading";

export default function CrmPage() {
  return (
    <AppShell>
      <PageHeading title="CRM" description="Отклики, ответы, приглашения, отказы и следующие действия." />
      <CrmTable />
    </AppShell>
  );
}
