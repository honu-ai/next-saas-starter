# Error Reporting Widget

A comprehensive error reporting system that leverages PostHog's event tracking capabilities to collect user feedback and automatically capture application errors.

## Features

- **Manual Error Reporting**: Users can manually report bugs and issues through an intuitive floating widget
- **Automatic Error Capture**: Automatically captures JavaScript errors, unhandled promise rejections, and network errors
- **Global Error Boundary**: Catches React component errors and provides a fallback UI with reporting options
- **PostHog Integration**: All error reports are sent as PostHog events for analysis and monitoring
- **Customizable Widget**: Configurable position, size, and theme options
- **Rich Context**: Automatically includes URL, user agent, session ID, and additional context

## Components

### ErrorReportingWidget

The main floating widget that allows users to manually report issues.

```tsx
import ErrorReportingWidget from '@/components/error-reporting-widget';

<ErrorReportingWidget position='bottom-right' size='medium' theme='auto' />;
```

**Props:**

- `position`: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
- `size`: 'small' | 'medium' | 'large'
- `theme`: 'light' | 'dark' | 'auto'
- `className`: Additional CSS classes

### useErrorReporting Hook

A React hook for programmatic error reporting.

```tsx
import { useErrorReporting } from '@/components/error-reporting-widget';

const { reportError, reportJSError, reportNetworkError, isReady } =
  useErrorReporting();

// Manual error reporting
await reportError({
  title: 'Feature not working',
  description: 'The login button is not responding',
  severity: 'high',
  category: 'bug',
});
```

### GlobalErrorBoundary

Catches React component errors and provides a fallback UI.

```tsx
import { GlobalErrorBoundary } from '@/components/error-reporting-widget';

<GlobalErrorBoundary>
  <App />
</GlobalErrorBoundary>;
```

### AutoErrorCapture

Automatically captures JavaScript and network errors.

```tsx
import { AutoErrorCapture } from '@/components/error-reporting-widget';

<AutoErrorCapture />;
```

## PostHog Events

The error reporting system sends the following events to PostHog:

### User Error Reports

- **Event**: `user_error_report`
- **Properties**:
  - `error_title`: Report title
  - `error_description`: Detailed description
  - `error_severity`: low | medium | high | critical
  - `error_category`: bug | feature_request | performance | ui_ux | other
  - `error_url`: Current page URL
  - `error_user_agent`: Browser user agent
  - `error_timestamp`: ISO timestamp
  - `error_session_id`: PostHog session ID

### JavaScript Errors

- **Event**: `javascript_error`
- **Properties**:
  - `error_message`: Error message
  - `error_stack`: Stack trace
  - `error_name`: Error type
  - `error_url`: Page URL where error occurred

### Network Errors

- **Event**: `network_error`
- **Properties**:
  - `error_url`: Failed request URL
  - `error_status`: HTTP status code
  - `error_status_text`: HTTP status text
  - `error_method`: HTTP method

### React Error Boundary

- **Event**: `react_error_boundary_triggered`
- **Properties**:
  - `error_message`: Error message
  - `error_stack`: Stack trace
  - `error_component_stack`: React component stack

## Error Categories

- **bug**: Software defects and malfunctions
- **feature_request**: Requests for new features
- **performance**: Performance-related issues
- **ui_ux**: User interface and experience problems
- **other**: General feedback and other issues

## Severity Levels

- **low**: Minor issues that don't affect core functionality
- **medium**: Issues that impact user experience but have workarounds
- **high**: Significant issues that affect core functionality
- **critical**: Severe issues that make the application unusable

## Integration

### Dashboard Layout

The widget is automatically included in the dashboard layout:

```tsx
// app/(dashboard)/layout.tsx
import ErrorReportingWidget, {
  AutoErrorCapture,
} from '@/components/error-reporting-widget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {children}
      <ErrorReportingWidget />
      <AutoErrorCapture />
    </section>
  );
}
```

### Root Layout

The global error boundary wraps the entire application:

```tsx
// app/layout.tsx
import { GlobalErrorBoundary } from '@/components/error-reporting-widget';

export default function RootLayout({ children }) {
  return (
    <PostHogProvider>
      <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
    </PostHogProvider>
  );
}
```

## PostHog Dashboard

To analyze error reports in PostHog:

1. **Events**: View all error-related events in the Events tab
2. **Insights**: Create insights to track error trends over time
3. **Funnels**: Analyze error patterns in user flows
4. **Cohorts**: Create cohorts of users who experience specific errors
5. **Dashboards**: Build comprehensive error monitoring dashboards

### Recommended Insights

1. **Error Report Volume**: Track `user_error_report` events over time
2. **Error Severity Distribution**: Breakdown of error reports by severity
3. **Error Categories**: Most common error categories
4. **JavaScript Error Rate**: Frequency of `javascript_error` events
5. **Network Error Patterns**: Analysis of failed API calls

## Development

### Testing the Widget

1. **Manual Testing**: Click the floating bug icon to open the reporting form
2. **Error Boundary Testing**: Trigger a React error to test the boundary
3. **JavaScript Error Testing**: Throw an unhandled error to test auto-capture
4. **Network Error Testing**: Make a failing API call to test network monitoring

### Storybook

The component includes Storybook stories for development and testing:

```bash
npm run storybook
```

Navigate to "Components/ErrorReportingWidget" to view and interact with the component.

## Best Practices

1. **Monitor PostHog Events**: Regularly check for new error reports
2. **Set Up Alerts**: Configure PostHog alerts for critical errors
3. **Categorize Issues**: Use the category and severity fields for prioritization
4. **Follow Up**: Respond to user reports when possible
5. **Privacy**: Ensure sensitive data is not captured in error reports

## Customization

### Styling

The widget uses Tailwind CSS and can be customized through the `className` prop or by modifying the component styles.

### Event Properties

Additional context can be added to error reports through the `additionalContext` field:

```tsx
reportError({
  title: 'Custom Error',
  description: 'Description',
  severity: 'medium',
  category: 'bug',
  additionalContext: {
    userId: user.id,
    featureFlag: 'new_feature_enabled',
    customData: { key: 'value' },
  },
});
```

## Troubleshooting

### Widget Not Appearing

- Ensure PostHog is properly initialized
- Check that the component is rendered within the PostHogProvider
- Verify environment variables are set

### Events Not Appearing in PostHog

- Check PostHog configuration and API keys
- Verify network connectivity
- Check browser console for errors

### Error Boundary Not Triggering

- Ensure the boundary wraps the component tree
- Test with a known error-throwing component
- Check React development tools for error boundaries
