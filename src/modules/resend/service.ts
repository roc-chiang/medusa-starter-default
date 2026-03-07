import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import {
    ProviderSendNotificationDTO,
    ProviderSendNotificationResultsDTO
} from "@medusajs/framework/types"
import { Resend } from "resend"

type ResendOptions = {
    api_key: string
    from: string
}

class ResendNotificationService extends AbstractNotificationProviderService {
    static identifier = "notification-resend"
    protected resend: Resend
    protected options: ResendOptions

    constructor({ logger }, options: ResendOptions) {
        super()
        this.resend = new Resend(options.api_key)
        this.options = options
    }

    async send(
        notification: ProviderSendNotificationDTO
    ): Promise<ProviderSendNotificationResultsDTO> {
        if (!notification.to) {
            throw new Error("No recipient specified")
        }

        const { data, error } = await this.resend.emails.send({
            from: this.options.from,
            to: notification.to,
            subject: (notification.data as any).subject || "Notification",
            html: (notification.data as any).html || `<p>${JSON.stringify(notification.data)}</p>`,
        })

        if (error) {
            throw new Error(`Resend error: ${error.message}`)
        }

        return { id: data!.id }
    }
}

export default ResendNotificationService
