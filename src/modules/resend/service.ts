import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import {
    ProviderSendNotificationDTO,
    ProviderSendNotificationResultsDTO,
    AdminNotificationResponse
} from "@medusajs/framework/types"
import { Resend } from "resend"

import { pardproTemplate } from "./templates/order-confirmation-pardpro"
import { sodiumTemplate } from "./templates/order-confirmation-sodium"
import { shipmentPardproTemplate } from "./templates/shipment-confirmation-pardpro"
import { shipmentSodiumTemplate } from "./templates/shipment-confirmation-sodium"

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

        const data = notification.data as any
        const order = data.order
        const brand = data.brand
        const template = notification.template

        if (!order) {
            throw new Error("No order data provided in notification")
        }

        let html = ""
        let subject = data.subject

        if (template === "shipment-confirmation") {
            const trackingNumber = data.trackingNumber || "Pending"
            const shippingCompany = data.shippingCompany || "Post Canada"
            html = brand === 'sodium'
                ? shipmentSodiumTemplate(order, trackingNumber, shippingCompany)
                : shipmentPardproTemplate(order, trackingNumber, shippingCompany)
            subject = subject || `Your order #${order.display_id} has shipped!`
        } else {
            // Default to order-confirmation
            html = brand === 'sodium'
                ? sodiumTemplate(order)
                : pardproTemplate(order)
            subject = subject || `Order Confirmed #${order.display_id}`
        }

        const { data: resendData, error } = await this.resend.emails.send({
            from: data.from || this.options.from,
            to: notification.to,
            subject,
            html,
        })

        if (error) {
            throw new Error(`Resend error: ${error.message}`)
        }

        return { id: resendData!.id }
    }
}

export default ResendNotificationService
