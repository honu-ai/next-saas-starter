# PostHog Error Reporting Dashboard Setup

This guide will help you set up comprehensive error monitoring and analysis in your PostHog dashboard.

## 🚀 Quick Start - View Error Reports

### 1. Real-time Event Monitoring

1. Go to **PostHog Dashboard** → **Events**
2. Filter by event name: `user_error_report`
3. Click on any event to see detailed properties

### 2. Event Types to Monitor

- `user_error_report` - Manual user reports
- `javascript_error` - Automatic JS errors
- `network_error` - API/Network failures
- `react_error_boundary_triggered` - React crashes

## 📊 Creating Error Monitoring Insights

### 1. Error Report Volume Over Time

```
Event: user_error_report
Chart Type: Line Chart
Breakdown: None
Date Range: Last 30 days
```

### 2. Error Severity Distribution

```
Event: user_error_report
Chart Type: Pie Chart
Breakdown: error_severity
Filter: None
```

### 3. Error Categories Analysis

```
Event: user_error_report
Chart Type: Bar Chart
Breakdown: error_category
Date Range: Last 7 days
```

### 4. JavaScript Error Rate

```
Event: javascript_error
Chart Type: Line Chart
Breakdown: None
Date Range: Last 24 hours
```

### 5. Network Error Patterns

```
Event: network_error
Chart Type: Table
Breakdown: error_url, error_status
Limit: 50
```

### 6. Page-specific Error Analysis

```
Event: user_error_report
Chart Type: Bar Chart
Breakdown: error_url
Filter: error_severity = "high" OR error_severity = "critical"
```

## 🎯 Setting Up Error Alerts

### 1. Critical Error Alert

1. Go to **Alerts** → **New Alert**
2. **Event**: `user_error_report`
3. **Condition**: `error_severity` equals `critical`
4. **Threshold**: More than 0 events in 1 hour
5. **Notification**: Email/Slack

### 2. High Error Volume Alert

1. **Event**: `user_error_report`
2. **Condition**: Any event
3. **Threshold**: More than 10 events in 1 hour
4. **Notification**: Email/Slack

### 3. JavaScript Error Spike Alert

1. **Event**: `javascript_error`
2. **Threshold**: More than 5 events in 15 minutes
3. **Notification**: Immediate alert

## 📈 Building Error Monitoring Dashboard

### Create a New Dashboard

1. Go to **Dashboards** → **New Dashboard**
2. Name it "Error Monitoring"
3. Add the following insights:

#### Dashboard Tiles:

**1. Error Overview (Top Row)**

- Total Error Reports (Last 7 days)
- Critical Errors (Last 24 hours)
- JavaScript Errors (Last 24 hours)
- Network Errors (Last 24 hours)

**2. Trends (Second Row)**

- Error Reports Over Time (Line chart)
- Error Severity Distribution (Pie chart)

**3. Analysis (Third Row)**

- Top Error Categories (Bar chart)
- Pages with Most Errors (Table)

**4. Technical Details (Bottom Row)**

- JavaScript Error Details (Table)
- Network Error Status Codes (Bar chart)

## 🔍 Advanced Analysis Queries

### 1. Find Users with Multiple Error Reports

```sql
SELECT
  distinct_id,
  COUNT(*) as error_count
FROM events
WHERE event = 'user_error_report'
  AND timestamp > now() - INTERVAL 7 DAY
GROUP BY distinct_id
HAVING error_count > 2
ORDER BY error_count DESC
```

### 2. Error Rate by Page

```sql
SELECT
  properties.error_url as page,
  COUNT(*) as total_errors,
  COUNT(CASE WHEN properties.error_severity = 'critical' THEN 1 END) as critical_errors
FROM events
WHERE event = 'user_error_report'
  AND timestamp > now() - INTERVAL 7 DAY
GROUP BY properties.error_url
ORDER BY total_errors DESC
```

### 3. Browser-specific JavaScript Errors

```sql
SELECT
  properties.error_user_agent as browser,
  COUNT(*) as js_errors
FROM events
WHERE event = 'javascript_error'
  AND timestamp > now() - INTERVAL 24 HOUR
GROUP BY properties.error_user_agent
ORDER BY js_errors DESC
```

## 🎨 Custom Event Properties

You can add custom properties to error reports:

```tsx
// In your component
const { reportError } = useErrorReporting();

await reportError({
  title: 'Custom Error',
  description: 'Error description',
  severity: 'high',
  category: 'bug',
  additionalContext: {
    userId: user.id,
    featureFlag: 'new_feature_enabled',
    customProperty: 'custom_value',
    // Add any custom data you want to track
  },
});
```

These will appear as `error_additional_context` in PostHog.

## 🔧 Testing Your Setup

### 1. Manual Testing

1. Click the floating bug icon in your app
2. Submit a test error report
3. Check PostHog Events tab for `user_error_report`

### 2. Automatic Error Testing

Use the ErrorTestingDemo component (development only):

- Triggers JavaScript errors
- Simulates network failures
- Tests React error boundaries

### 3. Verify Event Properties

Check that these properties appear in your events:

- `error_title`
- `error_description`
- `error_severity`
- `error_category`
- `error_url`
- `error_timestamp`

## 📱 Mobile/Responsive Considerations

The error widget is responsive and works on mobile:

- Touch-friendly button size
- Mobile-optimized form
- Responsive dialog layout

## 🔐 Privacy & Security

### Data Included in Reports:

- ✅ Page URL
- ✅ Browser user agent
- ✅ Error messages and stack traces
- ✅ PostHog session ID

### Data NOT Included:

- ❌ Personal information (unless explicitly added)
- ❌ Form data or user inputs
- ❌ Authentication tokens
- ❌ Sensitive application data

## 🚨 Troubleshooting

### Events Not Appearing?

1. Check PostHog API key in environment variables
2. Verify PostHog is initialized before error reporting
3. Check browser console for PostHog errors
4. Ensure you're looking at the correct project

### Widget Not Showing?

1. Verify PostHog provider wraps your app
2. Check that widget is rendered in dashboard layout
3. Ensure PostHog is ready (`isReady` in hook)

### Error Boundary Not Triggering?

1. Test with ErrorTestingDemo component
2. Check React DevTools for error boundaries
3. Verify GlobalErrorBoundary wraps your app

## 📊 Sample PostHog Queries

### Most Common Error Messages

Filter events where `event = 'user_error_report'` and group by `error_title`

### Critical Errors by User

Filter by `error_severity = 'critical'` and group by `distinct_id`

### Errors by Feature

Filter by `error_category = 'feature_request'` to see feature requests

### Performance Issues

Filter by `error_category = 'performance'` to track performance problems

This setup gives you comprehensive error monitoring and user feedback collection through PostHog's powerful analytics platform!
