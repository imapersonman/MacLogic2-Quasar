<template>
  <q-layout view="hHr lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Tests
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>

        <q-item-label header>
          Component Tests
        </q-item-label>

        <q-item to="/tests/sequent_input" exact>
          SequentInput
        </q-item>
        <q-item to="/tests/tactic_selector" exact>
          TacticSelector
        </q-item>
        <q-item to="/tests/maclogic_constructor" exact>
          MacLogicConstructor
        </q-item>
        <q-item to="/tests/interactive_cnf" exact>
          Interactive CNF
        </q-item>
        <q-item to="/tests/ast" exact>
          Ast Playground
        </q-item>
        
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
