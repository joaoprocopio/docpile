<script setup lang="ts">
import { tryOnScopeDispose } from "@vueuse/core"
import * as commands from "prosemirror-commands"
import * as history from "prosemirror-history"
import * as keymap from "prosemirror-keymap"
import * as schemaBasic from "prosemirror-schema-basic"
import * as state from "prosemirror-state"
import * as view from "prosemirror-view"
import { onMounted, shallowRef, useTemplateRef } from "vue"
import { Button } from "~/lib/ui/button"
import { Separator } from "~/lib/ui/separator"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"
import { Triangle } from "~/lib/ui/triangle"

const sidebar = useSidebar()
const editorRef = useTemplateRef("editor")

const editorState = shallowRef<state.EditorState | undefined>(undefined)
const editorView = shallowRef<view.EditorView | undefined>(undefined)

onMounted(() => {
    editorState.value = state.EditorState.create({
        schema: schemaBasic.schema,
        plugins: [history.history(), keymap.keymap(commands.baseKeymap)],
    })

    editorView.value = new view.EditorView(editorRef.value, {
        state: editorState.value,
    })
})

tryOnScopeDispose(() => {
    if (editorView.value) {
        editorView.value.destroy()
    }
})
</script>

<template>
    <div>
        <div
            class="sticky inset-x-0 top-0 z-10 mx-6 overflow-hidden rounded-b-md bg-background/40 backdrop-blur">
            <div class="flex items-center gap-2 border-b px-4 py-1.5 text-sm">
                <SidebarTrigger
                    v-if="!sidebar.open.value"
                    size="sm" />

                <h1 class="truncate font-semibold">Scoped API Keys</h1>

                <Button
                    variant="ghost"
                    size="xs">
                    File
                </Button>
                <Button
                    variant="ghost"
                    size="xs">
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="xs">
                    Insert
                </Button>

                <p class="ml-auto truncate text-xs text-muted-foreground">Edited 42min ago</p>
                <Button
                    size="xs"
                    variant="secondary">
                    Share
                </Button>
            </div>

            <div
                class="flex items-center gap-2 px-4 py-1 [&>button:has(svg:only-child)]:size-7 [&>button>svg]:size-4!">
                <Button
                    variant="ghost"
                    size="icon"
                    @click="
                        () => history.undo(editorView!.state, editorView!.dispatch, editorView!)
                    ">
                    <Icon name="lucide:undo-2" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    @click="
                        () => history.redo(editorView!.state, editorView!.dispatch, editorView!)
                    ">
                    <Icon name="lucide:redo-2" />
                </Button>

                <Separator
                    class="mx-1 data-[orientation=vertical]:h-4"
                    orientation="vertical" />

                <Button
                    variant="ghost"
                    size="xs">
                    <span class="text-foreground"> Normal text </span>
                    <Triangle />
                </Button>

                <Separator
                    class="mx-1 data-[orientation=vertical]:h-4"
                    orientation="vertical" />

                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:bold" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:italic" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:underline" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:strikethrough" />
                </Button>

                <Separator
                    class="mx-1 data-[orientation=vertical]:h-4"
                    orientation="vertical" />

                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:link" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:external-link" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon">
                    <Icon name="lucide:image" />
                </Button>

                <Button
                    class="ml-auto"
                    variant="ghost"
                    size="xs">
                    <Icon name="lucide:square-pen" />
                    <span class="text-foreground"> Edit mode </span>
                    <Triangle />
                </Button>
            </div>
        </div>

        <h1>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel hendrerit metus,
            eget vulputate magna. Sed fringilla lectus nec ex convallis, non hendrerit eros
            efficitur. Donec in finibus felis, ut egestas tortor. Pellentesque ac varius odio. Ut
            finibus consequat dolor quis maximus. Ut facilisis convallis nibh non dictum. Proin
            ultricies lacinia est eget congue. Vestibulum eu tempus lectus, eget feugiat augue.
            Phasellus semper mauris facilisis, laoreet leo at, viverra tortor. Fusce hendrerit ut
            tellus eget molestie. Donec elementum tempus nunc, nec ultrices sem tempus at. Vivamus
            vel libero tempus, tincidunt est eu, gravida tellus. Curabitur sit amet vulputate magna,
            id accumsan orci. Phasellus vel sollicitudin massa. Etiam vitae mi a magna venenatis
            maximus. Curabitur viverra venenatis metus in eleifend. Morbi id eros ligula. Aliquam
            suscipit et ante ac tristique. Maecenas sed erat vitae risus feugiat interdum mollis nec
            libero. Aliquam non orci quis justo sodales porta. Quisque ac sodales quam. Quisque et
            egestas orci. Pellentesque convallis, nunc vitae ultrices pulvinar, augue eros consequat
            massa, vitae ornare libero diam at elit. Maecenas iaculis magna at pretium facilisis.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Curabitur vitae vestibulum ligula. Sed tempus mauris nec rhoncus tempor.
            Curabitur aliquam, lorem a blandit facilisis, velit massa scelerisque nisl, et semper
            libero mi ut elit. Aenean consectetur vitae metus id volutpat. Cras sed turpis luctus
            arcu rutrum bibendum. Morbi nec nibh nisi. Donec tincidunt varius est, pellentesque
            varius eros rutrum a. Donec aliquet ipsum vulputate nunc egestas, sit amet suscipit sem
            tincidunt. Aliquam rhoncus pulvinar lectus non porta. Vivamus pretium pharetra leo eu
            cursus. Vivamus at ullamcorper nunc. Donec mollis neque a sodales vehicula. Duis vel
            ligula ligula. Donec diam dolor, luctus iaculis luctus in, auctor vitae sapien. Aliquam
            blandit venenatis urna. In eget nibh eu magna finibus sagittis sed nec orci. Phasellus
            posuere odio eget aliquet consectetur. Morbi pellentesque dolor ut volutpat molestie.
            Aliquam vitae accumsan odio. Praesent vestibulum, leo ut vestibulum finibus, massa erat
            euismod ex, nec suscipit eros neque vitae ipsum. Mauris aliquam non libero nec
            venenatis. Nunc gravida ante ut congue sagittis. Sed eu efficitur lacus. Praesent eu
            luctus enim, lobortis semper diam. Integer metus erat, accumsan non imperdiet accumsan,
            convallis a lorem. Maecenas at condimentum ante, non dignissim dolor. Praesent pharetra
            eget massa sed congue. Integer viverra urna nec quam convallis sodales. Curabitur
            venenatis dapibus pellentesque. Phasellus viverra laoreet magna, vel mollis neque
            fringilla id. Integer sed congue risus. Fusce quis quam ut dolor facilisis venenatis.
            Nunc at tellus vel metus lacinia aliquam in quis diam. Nulla nec mi pellentesque,
            finibus felis nec, viverra quam. Mauris condimentum, mi in ultricies eleifend, augue
            purus bibendum quam, quis varius lorem ipsum quis tortor. Vestibulum ornare felis nulla,
            id malesuada enim eleifend sed. Sed quis arcu tortor. Duis vitae arcu odio. Vivamus
            lacus metus, mollis nec auctor a, vestibulum at tellus. Nunc at dapibus lectus. Aliquam
            id euismod felis. Donec pretium, tellus et convallis commodo, mi urna interdum ante, sed
            imperdiet purus erat nec leo. Donec vitae nisi at nunc cursus ornare. Integer molestie
            finibus auctor. Phasellus tristique vitae diam eget ultrices. Integer condimentum
            dignissim varius. Maecenas egestas et diam ut euismod. Aliquam magna dui, facilisis
            vitae nulla ac, tincidunt rutrum diam. Etiam nec mi pulvinar mi ornare ullamcorper nec
            nec purus. Nullam ultrices pulvinar metus et mollis. Curabitur at nisi nibh. In
            consectetur tempus quam eget consectetur. Aenean et efficitur mi. Vivamus vehicula
            commodo laoreet. Integer pulvinar ligula sit amet ex iaculis, vitae tincidunt metus
            blandit. Etiam blandit, neque vel tristique porttitor, nisl lacus faucibus neque, quis
            interdum mauris neque non ligula. Nunc metus tortor, aliquet at lectus nec, dapibus
            pulvinar eros. Donec lacus eros, eleifend in viverra in, dignissim non lectus.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Ut ut commodo justo. Nam lobortis ex sapien, ac auctor ex semper id. Curabitur
            suscipit eu enim ut auctor. Nullam vitae cursus leo. Aenean ut odio consectetur, congue
            purus non, ultrices tortor. In egestas sodales ultricies. Phasellus vel justo vel ligula
            cursus consequat. Curabitur nec nisl at augue ultrices cursus lacinia vel felis. Donec
            cursus arcu neque, et accumsan dolor faucibus vitae. In hac habitasse platea dictumst.
            Mauris quis suscipit felis. Vivamus convallis, tortor vel porta finibus, neque mi porta
            enim, eget varius ligula massa id elit. Suspendisse sapien dui, suscipit sed commodo id,
            congue id ligula. Sed lacus libero, gravida nec nunc nec, tincidunt faucibus est. In hac
            habitasse platea dictumst. Pellentesque in nisl ut erat tempor rutrum eget sit amet
            nulla. Suspendisse ex ante, pulvinar sed elit sed, porttitor venenatis lacus. In ornare
            faucibus blandit. Aenean gravida consequat tempus. Sed lectus dui, interdum sed
            porttitor sit amet, fermentum eu felis. Phasellus nisi lorem, consectetur vel dolor
            quis, ultricies imperdiet neque. Duis congue aliquet ligula, et condimentum purus
            feugiat eu. Cras elit metus, sagittis a dictum vel, varius ac urna. Donec volutpat mi
            eget justo rutrum sodales. In nec lectus semper erat convallis cursus a convallis nibh.
            Nullam mi elit, faucibus eu purus rhoncus, interdum fermentum turpis. Donec sit amet
            purus lorem. Donec tempor tortor eu eros finibus suscipit. Quisque laoreet lacinia ex,
            vel rhoncus sem vulputate convallis. Aliquam erat volutpat. Duis posuere cursus leo quis
            egestas. Vivamus feugiat, ligula sit amet mollis dignissim, lorem turpis laoreet nisl,
            sed sodales turpis justo non justo. Praesent rutrum quis nisl at lobortis. Integer sit
            amet ipsum ullamcorper, posuere sem sed, vestibulum leo. Sed at libero at ipsum sagittis
            varius. Etiam venenatis orci eu luctus ornare. Phasellus tempus nisi lorem. Pellentesque
            vel vulputate leo, vitae molestie augue. Vivamus viverra nunc ac dapibus pulvinar. Ut ut
            quam massa. Sed elementum dui ac commodo tempor. Pellentesque condimentum augue sed
            pulvinar vehicula. Aliquam at elementum massa, sit amet rhoncus neque. Etiam blandit dui
            mi, id lacinia ante porta id. Etiam consequat imperdiet lectus, sed feugiat felis
            elementum a. Pellentesque a erat sed ligula congue faucibus eget eget lectus. Fusce sit
            amet lectus nibh. Integer sapien arcu, auctor eget ornare eget, consectetur non mauris.
            Etiam fringilla metus id quam euismod tristique. Morbi et justo vitae est accumsan
            interdum. Suspendisse potenti. Nullam sagittis lectus ut nisi scelerisque volutpat.
            Praesent at nunc vel elit rutrum sodales nec quis diam. Duis pretium, odio ut sodales
            posuere, sem turpis dapibus purus, vitae auctor velit sem quis libero. Etiam porttitor,
            lectus sit amet auctor molestie, tortor risus sollicitudin risus, non tempus nisl nulla
            non dolor. Vivamus vestibulum rutrum lacus, at suscipit nisi molestie id. Curabitur id
            risus tortor. Suspendisse scelerisque gravida tincidunt. Vestibulum consectetur laoreet
            quam, ac consectetur odio sollicitudin vitae. Maecenas ac sem et mauris ultricies
            faucibus nec non risus. Phasellus lacus lacus, tincidunt ac tortor vitae, pharetra
            pharetra lacus. Pellentesque auctor convallis diam, sed varius purus sagittis in. Cras
            nisi libero, sodales ut sollicitudin et, tincidunt at neque. Praesent consequat augue
            mollis vehicula aliquam. Phasellus sagittis at odio nec volutpat. Aliquam finibus, justo
            quis lacinia porttitor, lectus ipsum euismod diam, at efficitur tellus tortor in metus.
            Nunc suscipit mollis viverra. Morbi porttitor semper nisi, vitae pulvinar purus rhoncus
            id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla dictum mollis diam
            tincidunt posuere. Sed risus odio, malesuada quis dignissim eu, maximus ac massa. Nunc
            sed vehicula sem. Curabitur elementum, libero et vestibulum sollicitudin, lacus velit
            venenatis dui, quis luctus eros arcu nec elit. Sed sagittis lacus quis dui luctus
            hendrerit. Pellentesque finibus vel dui at rutrum. Donec accumsan, augue sit amet
            condimentum convallis, mi felis venenatis massa, eget efficitur ex libero ut sapien.
            Phasellus dignissim nibh massa, ac euismod lacus convallis a. Mauris luctus vestibulum
            convallis. Nullam nec ex suscipit, blandit est non, feugiat dolor. Nam at eleifend erat.
            Quisque mollis massa ante, id sollicitudin massa fermentum porttitor. Phasellus blandit,
            ligula ac rutrum lobortis, lorem sem sagittis lorem, in elementum lorem velit sed felis.
            Suspendisse ut varius odio, sed tincidunt sem. Curabitur ac vehicula nibh. Nullam
            placerat nec nisi in pulvinar. Quisque ut leo nec erat sagittis rutrum sit amet aliquam
            leo. Sed dictum urna vitae lorem varius, a sollicitudin risus convallis. Nam laoreet,
            ante semper porttitor facilisis, lectus ex posuere dolor, rutrum malesuada felis tortor
            quis lacus. Suspendisse potenti. Curabitur mattis mollis finibus. Donec luctus auctor
            venenatis. Donec nec sem posuere, auctor est at, porta turpis. Maecenas erat ligula,
            semper eget rhoncus aliquam, convallis vitae purus. Donec feugiat diam odio, vitae
            vestibulum ante mattis et. Aenean pretium turpis a nulla tincidunt bibendum. Proin dolor
            mi, tempus ornare odio elementum, scelerisque feugiat justo. Cras sed turpis sit amet
            ipsum interdum commodo eu in ante. Mauris non mollis massa, ac efficitur est. Vivamus
            vitae elementum justo, aliquam imperdiet massa. Pellentesque consequat bibendum elit, et
            bibendum dui tristique eget. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Donec lacinia elit vitae placerat malesuada. Nulla
            sed nisi tincidunt, imperdiet quam vel, convallis orci. Aenean ac neque sit amet lorem
            interdum cursus. Nullam facilisis malesuada elit in condimentum. Etiam nec purus ac orci
            condimentum consequat vitae gravida est. Vivamus blandit vitae diam vel vehicula.
            Quisque id eros non elit iaculis fringilla. Donec porttitor tellus sit amet accumsan
            hendrerit. Morbi at tempus lorem. Cras efficitur pretium mi, et sollicitudin metus
            aliquam maximus. Integer id nunc rutrum, facilisis urna ac, lobortis nibh. Fusce a
            euismod justo, at bibendum mi. Integer finibus id neque maximus mattis. Aliquam nisl
            metus, imperdiet a pretium ut, molestie eu massa. Maecenas porta velit nec arcu aliquet
            faucibus. Morbi rutrum diam eget faucibus malesuada. Aliquam eleifend tortor non
            condimentum convallis. Integer est est, varius ut metus non, efficitur pharetra nunc. Ut
            sit amet porttitor augue. Vestibulum posuere neque ligula, accumsan interdum mi eleifend
            ac. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc pretium placerat
            nisi vel finibus. Aliquam posuere congue arcu a tempor. In elit tellus, gravida faucibus
            efficitur non, accumsan ac dolor. Aliquam erat volutpat. Morbi consequat efficitur
            ultricies. Aliquam erat volutpat. Nulla pellentesque sem ac fermentum iaculis.
        </h1>

        <div class="min-h-[1000px] px-6 py-6">
            <div
                ref="editor"
                class="mx-auto max-w-xl px-4" />
        </div>
    </div>
</template>

<style>
.ProseMirror {
    position: relative;
    outline: none;
}

.ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror pre {
    white-space: pre-wrap;
}

.ProseMirror li {
    position: relative;
}

.ProseMirror-hideselection *::selection {
    background: transparent;
}
.ProseMirror-hideselection *::-moz-selection {
    background: transparent;
}
.ProseMirror-hideselection {
    caret-color: transparent;
}

/* See https://github.com/ProseMirror/prosemirror/issues/1421#issuecomment-1759320191 */
.ProseMirror [draggable][contenteditable="false"] {
    user-select: text;
}

.ProseMirror-selectednode {
    outline: 2px solid #8cf;
}

/* Make sure li selections wrap around markers */

li.ProseMirror-selectednode {
    outline: none;
}

li.ProseMirror-selectednode:after {
    content: "";
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
}

/* Protect against generic img rules */

img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
}
</style>
