export interface ErrorReport {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'bug' | 'feature_request' | 'performance' | 'ui_ux' | 'other';
  url?: string;
  userAgent?: string;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
  additionalContext?: Record<string, any>;
}

export interface ErrorReportingWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'auto';
}

export interface UseErrorReportingOptions {
  autoCapture?: boolean;
  includeUserAgent?: boolean;
  includeUrl?: boolean;
  includeSessionData?: boolean;
}
