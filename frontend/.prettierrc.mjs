/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
    printWidth: 100,
    tabWidth: 4,
    singleQuote: true,
    semi: false,
    trailingComma: 'es5',
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: ['^react$', '^next$', '^next/.*$', '\\.css$', '.*styles.css$'],
}

export default config
