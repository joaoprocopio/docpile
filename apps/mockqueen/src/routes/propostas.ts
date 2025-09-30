import { defineEventHandler } from "h3"

import { makeProposta } from "~/data/maker"
import { IProposta, TPropostaStatus } from "~/data/schemas"
import { array } from "~/utils/array"
import { isArray } from "~/utils/is"
import { randomInt } from "~/utils/random"

export default defineEventHandler((event) => {
    const propostas = array(randomInt(5, 100)).map(() => makeProposta(event))

    const grouped = propostas.reduce(
        (group, proposta) => {
            if (!isArray(group[proposta.status])) {
                group[proposta.status] = []
            }

            group[proposta.status].push(proposta)

            return group
        },
        {} as Record<TPropostaStatus, IProposta[]>,
    )

    return grouped
})
