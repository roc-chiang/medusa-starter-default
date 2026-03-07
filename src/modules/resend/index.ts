import ResendNotificationService from "./service"
import { ModuleProviderExports } from "@medusajs/framework/types"

const services = [ResendNotificationService]

export default {
    services,
} as ModuleProviderExports
