import { useTranslation } from "react-i18next";
import { useSystemErrorLogs } from "@/hooks/use-system-error-logs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";
import { format } from "date-fns";

interface SystemErrorLogsProps {
  ticketId: number;
  className?: string;
}

export function SystemErrorLogs({ ticketId, className = '' }: SystemErrorLogsProps) {
  const { t } = useTranslation();
  const { data: errorLogs, isLoading } = useSystemErrorLogs(ticketId);

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!errorLogs || errorLogs.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            {t('ticketDetail.systemErrorLogs.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('ticketDetail.systemErrorLogs.noLogs')}</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get badge color based on tag
  const getTagColor = (tag: string) => {
    if (tag.includes('error') || tag.includes('critical')) return "destructive";
    if (tag.includes('warning')) return "warning";
    if (tag.includes('info')) return "default";
    return "secondary";
  };

  // Helper function to get icon based on error severity
  const getErrorIcon = (tags: string[]) => {
    if (tags.some(tag => tag.includes('critical'))) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (tags.some(tag => tag.includes('error'))) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else if (tags.some(tag => tag.includes('warning'))) {
      return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    }
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
          {t('ticketDetail.systemErrorLogs.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorLogs.map(log => (
          <div key={log.id} className="space-y-3 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getErrorIcon(log.tags)}
                <span className="font-semibold">
                  {log.errorCode}: {log.moduleName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(new Date(log.createTime), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
            
            <p>{log.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {log.tags.map((tag, index) => (
                <Badge key={index} variant={getTagColor(tag) as any}>
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline">
                {log.action}
              </Badge>
            </div>
            
            {Object.keys(log.info).length > 0 && (
              <>
                <Separator />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{t('ticketDetail.systemErrorLogs.additionalInfo')}:</p>
                  <ul className="ml-2 space-y-1">
                    {Object.entries(log.info).map(([key, value]) => (
                      <li key={key} className="text-muted-foreground">
                        <span className="font-medium">{key}:</span> {value.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}