import { useQuery } from "@tanstack/react-query";
import { SysErrorLog } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useSystemErrorLogs(ticketId: number) {
  return useQuery<SysErrorLog[]>({
    queryKey: [`/api/tickets/${ticketId}/system-error-logs`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!ticketId,
  });
}