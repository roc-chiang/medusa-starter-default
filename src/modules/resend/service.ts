import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import {
    ProviderSendNotificationDTO,
    ProviderSendNotificationResultsDTO,
    AdminNotificationResponse
} from "@medusajs/framework/types"
import { Resend } from "resend"

import { pardproTemplate } from "./templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./templates/order-confirmation-sodium"

type ResendOptions = {
    api_key: string
    from: string
}

class ResendNotificationService extends AbstractNotificationProviderService {
    static identifier = "notification-resend"
    protected resend: Resend
    protected options: ResendOptions
    protected logger: any

    constructor({ logger }, options: ResendOptions) {
        super()
        this.resend = new Resend(options.api_key)
        this.options = options
        this.logger = logger
    }

    async send(
        notification: ProviderSendNotificationDTO
    ): Promise<ProviderSendNotificationResultsDTO> {
        if (!notification.to) {
            throw new Error("No recipient specified")
        }

        const order = (notification.data as any).order
        const brand = (notification.data as any).brand

        if (!order) {
            throw new Error("No order data provided in notification")
        }

        this.logger.info(`Order fields: total=${order.total}, subtotal=${order.subtotal}, shipping=${order.shipping_total}, tax=${order.tax_total}`)

        const html = brand === 'sodium'
            ? sodiumTemplate(order)
            : pardproTemplate(order)

        const { data, error } = await this.resend.emails.send({
            from: (notification.data as any).from || this.options.from,
            to: notification.to,
            subject: (notification.data as any).subject || `Order Confirmed #${order.display_id}`,
            html,
        })

        if (error) {
            throw new Error(`Resend error: ${error.message}`)
        }

        return { id: data!.id }
    }
}

export default ResendNotificationService
