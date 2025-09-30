import { faker } from "@faker-js/faker/locale/pt_BR"
import { EventHandlerRequest } from "h3"
import { getRequestURL, H3Event } from "h3"

import {
    IProposta,
    IPropostaAssignee,
    IPropostaAttachment,
    PropostaAttachmentMimeType,
    PropostaStatus,
    TPropostaMimeType,
    TPropostaStatus,
} from "~/data/schemas"
import { array } from "~/utils/array"
import { randomBool, randomEnumValue, randomInt } from "~/utils/random"

let propostaId = 1
export function makeProposta(event: H3Event<EventHandlerRequest>): IProposta {
    return {
        id: propostaId++,
        name: faker.commerce.productName(),
        status: randomEnumValue(PropostaStatus) as TPropostaStatus,
        assignee: randomBool() ? makeAssignee() : null,
        attachments: array(randomInt(0, 5)).map(() => makeAttachment(event)),
    }
}

let attachmentId = 1
export function makeAttachment(event: H3Event<EventHandlerRequest>): IPropostaAttachment {
    const requestURL = getRequestURL(event)

    const mime = randomEnumValue(PropostaAttachmentMimeType)
    const ext = faker.system.fileExt(mime)
    const file = faker.system.commonFileName(ext)
    const url = `${requestURL.origin}/static/${file}`

    return {
        id: attachmentId++,
        url: url,
        file: file,
        mimetype: mime as TPropostaMimeType,
    }
}

let assigneeId = 1
export function makeAssignee(): IPropostaAssignee {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const fullName = faker.person.fullName({ firstName, lastName })
    const email = faker.internet.email({ firstName, lastName })

    return {
        id: assigneeId++,
        email: email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
    }
}
