import { TEnum } from "~/utils/enums"

export type TPropostaStatus = "backlog" | "prospectando" | "negociando" | "proposta" | "aprovado"

export type TPropostaMimeType = "application/pdf" | "image/jpeg" | "image/png" | "image/webp"

export const PropostaStatus = {
    Backlog: "backlog",
    Prospectando: "prospectando",
    Negociando: "negociando",
    Proposta: "proposta",
    Aprovado: "aprovado",
} as const satisfies TEnum<string, TPropostaStatus>

export const PropostaAttachmentMimeType = {
    PDF: "application/pdf",
    JPG: "image/jpeg",
    JPEG: "image/jpeg",
    PNG: "image/png",
    WEBP: "image/webp",
} as const satisfies TEnum<string, TPropostaMimeType>

export interface IProposta {
    id: number
    name: string
    status: TPropostaStatus
    assignee: IPropostaAssignee | null
    attachments: IPropostaAttachment[]
}

export interface IPropostaAssignee {
    id: number
    email: string
    first_name: string
    last_name: string
    full_name: string
}

export interface IPropostaAttachment {
    id: number
    file: string
    url: string
    mimetype: TPropostaMimeType
}
