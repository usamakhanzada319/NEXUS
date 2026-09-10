// to trigger Webhook ,Slack webhook
// webhook =>notify event external system (Zapier, Google Sheets, and other app)
// Slack=> send real time alerts to Team member
// alerts=>(budget alert, anomaly, etc.)
// save the user webhook URL in setting page and done the Post request on the URL and external system receive  the request

import { useCallback, } from "react";
import { useNotification } from "../context/NotificationContext";



interface WebhookPayload {
    event: string,
    timeStamp: string,
    data: Record<string, any>
}

export const useWebhook = () => {
    const { addNotification } = useNotification()
    /**
   * Slack Webhook trigger
   * for Slack send message on channel
   */
    const triggerSlackWebhook = useCallback(async (message: string, data?: Record<string, any>) => {

        // get Webhook URL from LocalStorage (users save it in settings)
        const slackURL = localStorage.getItem("nexus_slack_webhook")

        if (!slackURL) {
            console.warn('Slack webhook URL not configured. Please set it in Settings.');
            addNotification('Slack webhook URL not configured', 'warning');
            return
        }

        // show in console(since we're in mock mode)
        console.log(' SLACK WEBHOOK TRIGGERED');
        console.log(' URL:', slackURL);
        console.log(' Message:', message);
        console.log(' Data:', data);
        try {
            //  Real API call (when  BackEnd is completed )
            // const response = await fetch(slackUrl, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ text: message, attachments: data ? [data] : [] }),
            // });

            await new Promise(resolve => setTimeout(resolve, 500))
            console.log(' Slack message sent successfully');
            addNotification('Slack message sent successfully', 'success');
            // Save to audit log
            // (Will be implemented in backEnd  Phase )
        } catch (error) {
            console.error(' Failed to send Slack message:', error);
            addNotification('Failed to send Slack message', 'error');
        }
    }, [addNotification])

    // Generic Webhook trigger

    // notify Event for any external system

    const triggerWebhook = useCallback(async (url: string, payload: WebhookPayload) => {
        if (!url) {
            console.warn('Webhook URL is empty');
            return;
        }
        console.log(' WEBHOOK TRIGGERED');
        console.log(' URL:', url);
        console.log(' Payload:', payload);
        try {

            // Real API call (active in backEnd  )
            // const response = await fetch(url, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(payload),


            // Mock mode — simulate success
            await new Promise(resolve => setTimeout(resolve, 300));


        } catch (error) {
            console.error('Failed to send webhook:', error);
            addNotification('Failed to send webhook', 'error');
        }
    }, [addNotification])

    /**
  * Budget Alert trigger
  * when budget cross limit , then Slack and webhook  both triggered
  */


    const triggerBudgetAlert = useCallback(async (teamName: string, spend: number, limit: number) => {

        const percent = Math.round((spend / limit) * 100);
        const message = `Budget Alert : ${teamName} has reached ${percent}% of monthly budget ($${spend} / $${limit})`

        // Slack notification
        await triggerSlackWebhook(message, {
            team: teamName,
            spent: spend,
            limit: limit,
            percent: percent,
            severity: percent >= 100 ? "Critical" : "Warning"
        })
        // External webhook notification
        const webhookUrl = localStorage.getItem("nexus_external_webhook");
        if (webhookUrl) {
            await triggerWebhook(webhookUrl, {
                event: "budget_alert",
                timeStamp: new Date().toISOString(),
                data: { teamName, spend, limit, percent }
            })
        }
    }, [triggerSlackWebhook, triggerWebhook])
    /**
  * Anomaly Alert trigger
  * when anomaly detect then,  Slack and webhook triggered 
  */
    const triggerAnomalyAlert = useCallback(async (teamName: string, anomaly: any) => {
        const message = `Anomaly Detected: ${teamName} - ${anomaly.description}`;
        await triggerSlackWebhook(message, {
            team: teamName,
            anomaly: anomaly,
            severity: anomaly.severity || 'Medium',
        })
        const webhookUrl = localStorage.getItem('nexus_external_webhook');

        if (webhookUrl) {
            await triggerWebhook(webhookUrl, {
                event: 'anomaly_detected',
                timeStamp: new Date().toISOString(),
                data: { teamName, anomaly }
            })
        }
    }, [triggerSlackWebhook, triggerWebhook])
    return {
        triggerSlackWebhook,//Slack channel message,team communication app/channel
        triggerAnomalyAlert,//Anomaly alert
        triggerBudgetAlert,//Budget alert
        triggerWebhook//Generic webhook Zapier/Google Sheets
    }
}