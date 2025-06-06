<script setup lang="ts">
/* eslint-disable import/first, import/no-duplicates */
import { ref, useMeta as useHead, useContext } from '@nuxtjs/composition-api';
import confetti from 'canvas-confetti';
import sleep from 'sleep-promise';
import useGtag from '~/composables/useGtag';
import useDarkMode from '~/composables/useDarkMode';
import useGameInfo from '~/composables/useGameInfo';
import useSheetDialog from '~/composables/useSheetDialog';
import sites from '~/data/sites.json';
import { RICK_SHEET } from '~/utils';

const context = useContext();
const gtag = useGtag();
const { isDarkMode } = useDarkMode();
const { gameCode } = useGameInfo();
const { viewSheet } = useSheetDialog();

const toggleDuration = 5000;
const toggle = ref(isDarkMode.value);
const toggleTimeoutId = ref<number | undefined>(undefined);

async function toggleLightSwitch(buttonPressed: boolean) {
  window.clearTimeout(toggleTimeoutId.value);
  toggleTimeoutId.value = undefined;

  toggle.value = buttonPressed ? !isDarkMode.value : isDarkMode.value;

  toggleTimeoutId.value = window.setTimeout(async () => {
    if (isDarkMode.value === toggle.value) return;

    isDarkMode.value = toggle.value;

    if (isDarkMode.value) {
      await sleep(1000);
      viewSheet(RICK_SHEET);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, zIndex: 999 });
      gtag('event', 'SecretFound', { gameCode: gameCode.value, eventSource: 'IndexPage', no: 1 });
    }
  }, toggleDuration);
}

useHead(() => ({
  titleTemplate: '%s',
  title: `${context.$config.siteTitle}`,
}));
</script>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'IndexPage',
  head: {},
});
</script>

<template>
  <v-container class="fill-height pa-4 pa-sm-8">
    <v-row class="align-center">
      <v-col cols="12" lg="5" class="text-center" style="user-select: none;">
        <link v-if="toggle" rel="preload" :href="RICK_SHEET.imageUrl" as="image">
        <v-icon
          :size="120"
          class="MagicLogo__icon my-6"
          :class="{ 'MagicLogo__icon--active': toggle, 'MagicLogo__icon--dark': isDarkMode }"
          :style="{ 'transition': `transform ${toggleDuration}ms !important` }"
          @pointerdown="toggleLightSwitch(true);"
          @pointerup="toggleLightSwitch(false);"
          @pointerleave="toggleLightSwitch(false);"
        >
          mdi-music-box-multiple
        </v-icon>
        <h1 class="mb-5">
          <span>arcade-songs</span>
        </h1>
        <p v-text="$t('page.index.description')" />
      </v-col>
      <v-col cols="12" lg="7">
        <v-list
          nav
          class="SiteList__container"
        >
          <v-list-item
            v-for="(site, i) in sites.filter((e) => !e.isHidden || isDarkMode)"
            :key="i"
            :to="{ name: 'gameCode', params: { gameCode: site.gameCode }}"
            class="SiteList__item px-4"
          >
            <v-list-item-icon>
              <v-icon :color="site.themeColor">
                mdi-music-box-multiple
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ site.gameTitle }}
            </v-list-item-title>
            <v-list-item-icon class="SiteList__arrow">
              <v-icon>mdi-arrow-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.SiteList {
  &__container {
    display: grid;
    margin: auto;

    @media (width < 800px) {
      max-width: 400px;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    @media (width >= 800px) {
      max-width: 800px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    /* xl */
    @media (width >= 1904px) {
      max-width: 1200px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__arrow {
    opacity: 0;
    transition: opacity 0.5s;
  }

  &__item:hover &__arrow {
    opacity: 1;
  }
}

.MagicLogo {
  &__icon {
    &::before {
      transition: color 1000ms;
    }

    &::after {
      display: none !important;
    }

    &--dark {
      &::before {
        color: yellow;
      }
    }

    &--active {
      transform: rotateZ(+5.125turn);
    }
  }
}
</style>
