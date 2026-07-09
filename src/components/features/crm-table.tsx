import { crmItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CrmTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM</CardTitle>
        <CardDescription>Мои отклики, статусы и следующие действия в одном списке.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <th className="py-3 pr-4">Возможность</th>
                <th className="py-3 pr-4">Статус</th>
                <th className="py-3 pr-4">Источник</th>
                <th className="py-3 pr-4">Value</th>
                <th className="py-3">Следующее действие</th>
              </tr>
            </thead>
            <tbody>
              {crmItems.map((item) => (
                <tr key={item.name} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{item.name}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">{item.stage}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{item.owner}</td>
                  <td className="py-3 pr-4 font-medium">{item.value}</td>
                  <td className="py-3 text-muted-foreground">{item.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
