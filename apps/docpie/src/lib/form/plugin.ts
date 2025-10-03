import { configure } from "vee-validate"

import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin(() => {
    configure({
        validateOnBlur: true,
        validateOnModelUpdate: false,
        validateOnChange: false,
        validateOnInput: false,
    })
})
