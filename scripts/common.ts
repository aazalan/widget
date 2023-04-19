import { Config } from 'amo-widget-builder';
import * as path from 'path';

export const config: Config = {
    name: {
        ru: 'Перенос слов'
    },
    description: {
        ru: 'Перенос слов в карточке'
    },
    shortDescription: {
        ru: 'Перенос'
    },
    tourDescription: {
        ru: 'Установи меня'
    },
    advancedSettingsTitle: {
        ru: 'Настройки переноса слов'
    },
    version: '1.0.0',
    fakeConfig: {
        required: false
    },
    locales: ['ru'],
    bundleDir: path.resolve(__dirname, '../dist'),
    outDir: path.resolve(__dirname, '..')
}