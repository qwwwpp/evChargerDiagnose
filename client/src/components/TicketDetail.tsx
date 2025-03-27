import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import type { Ticket, Event, MaintenanceHistory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TicketDetailProps {
  ticket: Ticket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");

  // Fetch diagnostic events data
  const { 
    data: events,
    isLoading: eventsLoading
  } = useQuery<Event[]>({
    queryKey: [`/api/tickets/${ticket.id}/events`],
    enabled: activeTab === "diagnostics" || activeTab === "details",
  });

  // Fetch maintenance history data
  const { 
    data: maintenanceHistories,
    isLoading: historiesLoading
  } = useQuery<MaintenanceHistory[]>({
    queryKey: [`/api/tickets/${ticket.id}/maintenance-history`],
    enabled: activeTab === "history" || activeTab === "details",
  });

  const handleResolveTicket = async () => {
    try {
      await apiRequest('PATCH', `/api/tickets/${ticket.id}`, {
        status: 'resolved'
      });
      
      // Invalidate tickets query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/tickets`] });
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
      case "in progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMMM d, yyyy");
  };

  return (
    <div className="w-full bg-white">
      <div className="h-full flex flex-col">
        {/* Ticket Header */}
        <div className="border-b border-slate-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-slate-900">{t('ticketDetail.ticket')} #{ticket.id}</h2>
                <div className="flex flex-wrap gap-2">
                  {ticket.status !== 'resolved' && ticket.priority === 'high' && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClasses('high')}`}>
                      {t('ticketDetail.highPriority')}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClasses(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
              <h3 className="text-lg text-slate-700 mb-2">{ticket.title}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{t('ticketDetail.created')}: {formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{t('ticketDetail.reportedBy')}: {ticket.reportedBy}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <span>{t('ticketDetail.assignedTo')}: {ticket.assignedTo || t('ticketDetail.unassigned')}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                {t('ticketDetail.edit')}
              </Button>
              {ticket.status !== 'resolved' && (
                <Button size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600" onClick={handleResolveTicket}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {t('ticketDetail.markResolved')}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="border-b border-slate-200 bg-transparent">
            <TabsTrigger 
              value="details"
              className="data-[state=active]:text-teal-700 data-[state=active]:border-teal-700 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-4 py-2"
            >
              {t('ticketDetail.tabs.details')}
            </TabsTrigger>
            <TabsTrigger 
              value="diagnostics"
              className="data-[state=active]:text-teal-700 data-[state=active]:border-teal-700 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-4 py-2"
            >
              {t('ticketDetail.tabs.diagnostics')}
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:text-teal-700 data-[state=active]:border-teal-700 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-4 py-2"
            >
              {t('ticketDetail.tabs.history')}
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="data-[state=active]:text-teal-700 data-[state=active]:border-teal-700 data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-4 py-2"
            >
              {t('ticketDetail.tabs.notes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-grow overflow-auto p-4 md:p-6 mt-0 border-0">
            {/* Device Information Section */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.deviceInfo')}</h4>
              <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-slate-500">{t('ticketDetail.chargerModel')}</div>
                    <div className="text-sm font-medium text-slate-900">{ticket.chargerModel}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.serialNumber')}</div>
                    <div className="text-sm font-medium text-slate-900">{ticket.chargerSerialNumber}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.chargerType')}</div>
                    <div className="text-sm font-medium text-slate-900">{ticket.chargerType}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.installDate')}</div>
                    <div className="text-sm font-medium text-slate-900">{formatDate(ticket.installedAt)}</div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-slate-500">{t('ticketDetail.lastMaintenance')}</div>
                    <div className="text-sm font-medium text-slate-900">{formatDate(ticket.lastMaintenance)}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.firmwareVersion')}</div>
                    <div className="text-sm font-medium text-slate-900">{ticket.firmwareVersion || 'N/A'}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.connectivity')}</div>
                    <div className="text-sm font-medium text-slate-900">{ticket.connectivity || 'N/A'}</div>
                    
                    <div className="text-sm text-slate-500">{t('ticketDetail.status')}</div>
                    <div className="text-sm font-medium text-slate-900">
                      {ticket.status === 'resolved' 
                        ? t('ticketDetail.statusValues.offlineResolved') 
                        : ticket.status === 'in-progress' 
                          ? t('ticketDetail.statusValues.onlineWithErrors') 
                          : t('ticketDetail.statusValues.onlineWithIssues')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.location')}</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-900">{ticket.location}</p>
                  <p className="text-sm text-slate-600">{ticket.locationDetails}</p>
                </div>
                <div className="aspect-video bg-slate-200 rounded-md flex items-center justify-center">
                  <div className="text-slate-500 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p>{t('ticketDetail.mapView')}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">{t('ticketDetail.siteContact')}</p>
                    <p className="text-sm font-medium text-slate-900">{ticket.siteContact || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('ticketDetail.contactPhone')}</p>
                    <p className="text-sm font-medium text-slate-900">{ticket.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t('ticketDetail.operatingHours')}</p>
                    <p className="text-sm font-medium text-slate-900">{ticket.operatingHours || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Description Section */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.problemDescription')}</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700 mb-4">{ticket.description}</p>
                {events && events.length > 0 && (
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <p className="text-xs font-medium text-slate-500 mb-2">{t('ticketDetail.errorCodesReported')}:</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Extract unique error codes from events */}
                      {Array.from(new Set(
                        events
                          .filter(event => event.status.toLowerCase() === 'error')
                          .map(event => {
                            const match = event.value.match(/E-\d+/);
                            return match ? match[0] : null;
                          })
                          .filter(Boolean)
                      )).map((errorCode, index) => (
                        <span key={index} className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {errorCode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Data Section for Details Tab */}
            {events && events.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.recentDiagnosticData')}</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="mb-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.timestamp')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.event')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.value')}</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.status')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {events.slice(0, 5).map((event) => (
                          <tr key={event.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">
                              {format(new Date(event.timestamp), "MMM d, hh:mm a")}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">{event.eventType}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">{event.value}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance History Section for Details Tab */}
            {maintenanceHistories && maintenanceHistories.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.recentMaintenance')}</h4>
                <div className="space-y-4">
                  {maintenanceHistories.slice(0, 1).map((history) => (
                    <div key={history.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900">{history.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{history.description}</p>
                          <div className="mt-2 flex items-center text-xs text-slate-500">
                            <span>{formatDate(history.performedAt)}</span>
                            <span className="mx-1">•</span>
                            <span>{t('ticketDetail.technician')}: {history.performedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="diagnostics" className="flex-grow overflow-auto p-4 md:p-6 mt-0 border-0">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.diagnosticData')}</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                {eventsLoading ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">{t('ticketDetail.loadingDiagnosticData')}...</p>
                  </div>
                ) : events && events.length > 0 ? (
                  <>
                    <div className="mb-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.timestamp')}</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.event')}</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.value')}</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('ticketDetail.table.status')}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {events.map((event) => (
                            <tr key={event.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">
                                {format(new Date(event.timestamp), "MMM d, hh:mm a")}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">{event.eventType}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-700">{event.value}</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(event.status)}`}>
                                  {event.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="link" size="sm" className="text-teal-700 hover:text-teal-800 h-auto p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {t('ticketDetail.exportLogData')}
                      </Button>
                      <Button variant="link" size="sm" className="text-teal-700 hover:text-teal-800 h-auto p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z" />
                        </svg>
                        {t('ticketDetail.runRemoteDiagnostic')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500">{t('ticketDetail.noDiagnosticData')}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-grow overflow-auto p-4 md:p-6 mt-0 border-0">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t('ticketDetail.maintenanceHistory')}</h4>
              
              {historiesLoading ? (
                <div className="text-center py-6">
                  <p className="text-slate-500">{t('ticketDetail.loadingMaintenanceHistory')}...</p>
                </div>
              ) : maintenanceHistories && maintenanceHistories.length > 0 ? (
                <div className="space-y-4">
                  {maintenanceHistories.map((history) => (
                    <div key={history.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900">{history.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{history.description}</p>
                          <div className="mt-2 flex items-center text-xs text-slate-500">
                            <span>{formatDate(history.performedAt)}</span>
                            <span className="mx-1">•</span>
                            <span>{t('ticketDetail.technician')}: {history.performedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">{t('ticketDetail.noMaintenanceHistory')}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="flex-grow overflow-auto p-4 md:p-6 mt-0 border-0">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-slate-600">{t('ticketDetail.noNotes')}</p>
              <Button className="mt-4 bg-teal-700 hover:bg-teal-800">
                {t('ticketDetail.addNote')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
