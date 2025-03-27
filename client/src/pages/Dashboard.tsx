import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { Ticket } from "@shared/schema";

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
    refetchOnWindowFocus: false,
  });

  // Calculate stats
  const totalTickets = tickets?.length || 0;
  const openTickets = tickets?.filter(t => t.status === 'open').length || 0;
  const inProgressTickets = tickets?.filter(t => t.status === 'in-progress').length || 0;
  const resolvedTickets = tickets?.filter(t => t.status === 'resolved').length || 0;
  const highPriorityTickets = tickets?.filter(t => t.priority === 'high').length || 0;

  // Calculate charger type distribution
  const chargerTypes = tickets?.reduce((acc, ticket) => {
    const type = ticket.chargerType;
    if (!acc[type]) acc[type] = 0;
    acc[type]++;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-16 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-8">{t('tickets.loading')}</div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{t('dashboard.summary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTickets}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{t('dashboard.openTickets')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{t('tickets.statusInProgress')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{inProgressTickets}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{t('tickets.highPriority')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{highPriorityTickets}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('tickets.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2">ID</th>
                        <th className="p-2">{t('ticket.description')}</th>
                        <th className="p-2">{t('tickets.status')}</th>
                        <th className="p-2">{t('tickets.priority')}</th>
                        <th className="p-2">{t('tickets.location')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets?.slice(0, 5).map(ticket => (
                        <tr key={ticket.id} className="border-b">
                          <td className="p-2">#{ticket.id}</td>
                          <td className="p-2">{ticket.title}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.status === 'open' ? t('tickets.statusOpen') :
                               ticket.status === 'in-progress' ? t('tickets.statusInProgress') :
                               t('tickets.statusResolved')}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {ticket.priority === 'high' ? t('tickets.highPriority') : t('tickets.normalPriority')}
                            </span>
                          </td>
                          <td className="p-2">{ticket.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.chargerTypes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(chargerTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <div className="w-2/3">
                        <div className="text-sm font-medium">{type}</div>
                        <div className="mt-1 w-full bg-slate-200 rounded-full h-2.5">
                          <div 
                            className="bg-teal-600 h-2.5 rounded-full" 
                            style={{ width: `${(count / totalTickets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-1/3 text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-sm text-slate-500 ml-1">({Math.round((count / totalTickets) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}
