import { computed, useRoute, useContext } from '@nuxtjs/composition-api';
import sites from '~/data/sites.json';

export default function useGameInfo() {
  const context = useContext();
  const route = useRoute();

  const siteInfo = computed(
    () => sites.find((site) => site.gameCode === route.value.params.gameCode),
  );

  const gameCode = computed(() => siteInfo.value?.gameCode ?? undefined);
  const gameTitle = computed(() => siteInfo.value?.gameTitle ?? undefined);
  const themeColor = computed(() => siteInfo.value?.themeColor ?? '#424242');
  const dataSourceUrl = computed(() => siteInfo.value?.dataSourceUrl ?? undefined);
  const accessCounterUrl = computed(() => (
    siteInfo.value?.accessCounterUrl ?? context.$config.indexAccessCounterUrl
  ));

  return {
    gameCode,
    gameTitle,
    themeColor,
    dataSourceUrl,
    accessCounterUrl,
  };
}
