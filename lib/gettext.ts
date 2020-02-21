import GetText from "node-gettext"

import { getLanguage } from "."

class GettextBuilder {

    private locale?: string
    private translations = {}

    setLanguage(language: string): GettextBuilder {
        this.locale = language
        return this
    }

    detectLocale(): GettextBuilder {
        return this.setLanguage(getLanguage())
    }

    addTranslation(language: string, data: any): GettextBuilder {
        this.translations[language] = data
        return this
    }

    build(): GettextWrapper {
        return new GettextWrapper(this.locale || 'en', this.translations)
    }

}

class GettextWrapper {

    private gt: GetText

    constructor(locale: string, data: any) {
        this.gt = new GetText()

        for (let key in data) {
            this.gt.addTranslations(key, 'messages', data[key])
        }

        this.gt.setLocale(locale)
    }

    private subtitudePlaceholders(translated: string, vars: object): string {
        return translated.replace(/{([^{}]*)}/g, (a, b) => {
            const r = vars[b]
            if (typeof r === 'string' || typeof r === 'number') {
                return r.toString()
            } else {
                return a
            }
        })
    }

    gettext(original: string, placeholders: object = {}): string {
        return this.subtitudePlaceholders(
            this.gt.gettext(original),
            placeholders
        )
    }

    ngettext(singular: string, plural: string, count: number, placeholders: object = {}): string {
        return this.subtitudePlaceholders(
            this.gt.ngettext(singular, plural, count).replace(/%n/g, count.toString()),
            placeholders
        )
    }

}

export function getGettextBuilder() {
    return new GettextBuilder()
}
