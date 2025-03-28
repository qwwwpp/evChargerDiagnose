import { useQuery } from "@tanstack/react-query";
import { SysErrorLog } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useSystemErrorLogs(ticketId: number) {
  return useQuery<SysErrorLog[]>({
    queryKey: [`/charging/sys_error_log?id=${ticketId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!ticketId,
  });
}